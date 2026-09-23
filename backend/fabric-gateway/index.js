require("dotenv").config();

const fs = require("node:fs/promises");
const crypto = require("node:crypto");
const grpc = require("@grpc/grpc-js");

const {
  connect,
  hash,
  signers,
} = require("@hyperledger/fabric-gateway");

async function main() {
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

  try {
    const network = gateway.getNetwork(
      process.env.FABRIC_CHANNEL
    );

    const contract = network.getContract(
      process.env.FABRIC_CHAINCODE
    );

    const result = await contract.evaluateTransaction(
      "GetBatch",
      "BATCH001"
    );

    console.log("FABRIC GATEWAY CONNECTED");
    console.log(
      "GetBatch result:",
      new TextDecoder().decode(result)
    );
  } finally {
    gateway.close();
    client.close();
  }
}

main().catch((error) => {
  console.error("FABRIC GATEWAY ERROR");
  console.error(error);
  process.exit(1);
});
