require("dotenv").config();

const http = require("node:http");
const fs = require("node:fs/promises");
const crypto = require("node:crypto");
const grpc = require("@grpc/grpc-js");

const {
  connect,
  hash,
  signers,
} = require("@hyperledger/fabric-gateway");

const PORT = 8081;
const HOST = "127.0.0.1";

const EVALUATE_FUNCTIONS = new Set([
  "GetBatch",
  "GetBatchHistory",
  "BatchExists",
]);

const SUBMIT_FUNCTIONS = new Set([
  "CreateBatch",
  "TransferBatch",
  "ReceiveBatch",
  "MarkAtPharmacy",
  "MarkAvailable",
]);

const utf8Decoder = new TextDecoder();

async function createGateway() {
  const certificate = await fs.readFile(
    process.env.FABRIC_CERT_PATH
  );

  const privateKeyPem = await fs.readFile(
    process.env.FABRIC_KEY_PATH
  );

  const tlsRootCert = await fs.readFile(
    process.env.FABRIC_TLS_CERT_PATH
  );

  const privateKey = crypto.createPrivateKey(
    privateKeyPem
  );

  const signer = signers.newPrivateKeySigner(
    privateKey
  );

  const client = new grpc.Client(
    process.env.FABRIC_PEER_ENDPOINT,
    grpc.credentials.createSsl(tlsRootCert),
    {
      "grpc.ssl_target_name_override":
        process.env.FABRIC_PEER_HOST_OVERRIDE,

      "grpc.default_authority":
        process.env.FABRIC_PEER_HOST_OVERRIDE,
    }
  );

  const gateway = connect({
    identity: {
      mspId: process.env.FABRIC_MSP_ID,
      credentials: certificate,
    },

    signer,

    hash: hash.sha256,

    client,
  });

  return {
    gateway,
    client,
  };
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(data));
}

function parseResult(resultBytes) {
  const decoded = utf8Decoder.decode(resultBytes);

  if (!decoded) {
    return null;
  }

  try {
    return JSON.parse(decoded);
  } catch {
    return decoded;
  }
}

function validateRequestBody(body) {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a JSON object");
  }

  if (
    typeof body.function !== "string" ||
    body.function.trim() === ""
  ) {
    throw new Error("Missing function");
  }

  if (!Array.isArray(body.args)) {
    throw new Error("args must be an array");
  }
}

async function withContract(callback) {
  const { gateway, client } = await createGateway();

  try {
    const network = gateway.getNetwork(
      process.env.FABRIC_CHANNEL
    );

    const contract = network.getContract(
      process.env.FABRIC_CHAINCODE
    );

    return await callback(contract);
  } finally {
    gateway.close();
    client.close();
  }
}

const server = http.createServer(async (req, res) => {
  try {
    // --------------------------------------------------
    // HEALTH
    // --------------------------------------------------

    if (
      req.method === "GET" &&
      req.url === "/health"
    ) {
      return sendJson(res, 200, {
        status: "healthy",
        service: "MediTrace Fabric Gateway",
        channel: process.env.FABRIC_CHANNEL,
        chaincode: process.env.FABRIC_CHAINCODE,
      });
    }

    // --------------------------------------------------
    // EVALUATE / QUERY
    // --------------------------------------------------

    if (
      req.method === "POST" &&
      req.url === "/evaluate"
    ) {
      const body = await readBody(req);

      validateRequestBody(body);

      if (!EVALUATE_FUNCTIONS.has(body.function)) {
        return sendJson(res, 400, {
          success: false,
          error: "Function not allowed for evaluate",
        });
      }

      const result = await withContract(
        async (contract) => {
          return await contract.evaluateTransaction(
            body.function,
            ...(body.args || [])
          );
        }
      );

      return sendJson(res, 200, {
        success: true,
        function: body.function,
        result: parseResult(result),
      });
    }

    // --------------------------------------------------
    // SUBMIT / WRITE
    // --------------------------------------------------

    if (
      req.method === "POST" &&
      req.url === "/submit"
    ) {
      const body = await readBody(req);

      validateRequestBody(body);

      if (!SUBMIT_FUNCTIONS.has(body.function)) {
        return sendJson(res, 400, {
          success: false,
          error: "Function not allowed for submit",
        });
      }

      const response = await withContract(
        async (contract) => {
          const commit = await contract.submitAsync(
            body.function,
            {
              arguments: body.args || [],
            }
          );

          const result = commit.getResult();
          const transactionId =
            commit.getTransactionId();

          const status = await commit.getStatus();

          if (!status.successful) {
            throw new Error(
              `Transaction ${transactionId} failed to commit with status code ${status.code}`
            );
          }

          return {
            transactionId,
            result: parseResult(result),
            committed: true,
            statusCode: status.code,
          };
        }
      );

      return sendJson(res, 200, {
        success: true,
        function: body.function,
        transaction_id: response.transactionId,
        result: response.result,
        committed: response.committed,
        status_code: response.statusCode,
      });
    }

    // --------------------------------------------------
    // NOT FOUND
    // --------------------------------------------------

    return sendJson(res, 404, {
      success: false,
      error: "Endpoint not found",
    });
  } catch (error) {
    console.error("FABRIC GATEWAY ERROR:", error);

    return sendJson(res, 500, {
      success: false,
      error: error.message,
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(
    `MediTrace Fabric Gateway running at http://${HOST}:${PORT}`
  );

  console.log(
    `Channel: ${process.env.FABRIC_CHANNEL}`
  );

  console.log(
    `Chaincode: ${process.env.FABRIC_CHAINCODE}`
  );
});
