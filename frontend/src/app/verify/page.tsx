"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  QrCode,
  ShieldCheck,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

type VerificationResult = {
  batch_id: string;
  medicine_name?: string;
  status: "VERIFIED" | "SUSPICIOUS";
  manufacturer?: string | null;
  distributor?: string | null;
  pharmacy?: string | null;
  manufacturer_verified?: boolean;
  distributor_verified?: boolean;
  pharmacy_verified?: boolean;
  blockchain_verified?: boolean;
  cold_chain_verified?: boolean;
  temperature_status?: string;
  trust_score: number;
  reasons?: string[];
  reason?: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function VerifyPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [verification, setVerification] =
    useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<any[]>([]);
const [showHistory, setShowHistory] = useState(false);
  // Extract batch ID from QR content
  const extractBatchId = (decodedText: string) => {
    const value = decodedText.trim();

    // Normal QR: MED-005
    if (!value.startsWith("http")) {
      return value;
    }

    // URL QR support
    try {
      const url = new URL(value);

      const batchFromQuery =
        url.searchParams.get("batch_id") ||
        url.searchParams.get("batch") ||
        url.searchParams.get("id");

      if (batchFromQuery) {
        return batchFromQuery;
      }

      const parts = url.pathname.split("/").filter(Boolean);

      if (parts.length > 0) {
        return parts[parts.length - 1];
      }
    } catch {
      return value;
    }

    return value;
  };

  // Call FastAPI verification API
  const verifyBatch = async (decodedText: string) => {
    const batchId = extractBatchId(decodedText);

    if (!batchId) {
      setError("Could not read a valid medicine batch ID from the QR code.");
      return;
    }

    setIsVerifying(true);
    setError("");
    setVerification(null);

    try {
      const response = await fetch(
        `${API_URL}/api/verify/${encodeURIComponent(batchId)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Unable to verify this medicine batch."
        );
      }

      setVerification(data);
      const historyResponse = await fetch(
  `${API_URL}/api/batches/${encodeURIComponent(batchId)}/history`
);

if (historyResponse.ok) {
  const historyData = await historyResponse.json();
  setHistory(historyData.history || []);
}
    } catch (err) {
      console.error("Verification API error:", err);

      setError(
        "Unable to connect to the verification server. Please make sure the mediSure backend is running."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSuccessfulScan = async (decodedText: string) => {
    console.log("QR CODE:", decodedText);

    setScanResult(decodedText);
    setIsScanning(false);

    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}

      scannerRef.current = null;
    }

    await verifyBatch(decodedText);
  };

  const startScanner = async () => {
    setError("");
    setScanResult(null);
    setVerification(null);

    if (scannerRef.current) {
      return;
    }

    try {
      const scanner = new Html5Qrcode("qr-reader");

      scannerRef.current = scanner;
      setIsScanning(true);

      await scanner.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
          aspectRatio: 1,
        },
        async (decodedText) => {
          await handleSuccessfulScan(decodedText);
        },
        () => {
          // Ignore continuous scan failures.
        }
      );
    } catch (err) {
      console.error("Camera error:", err);

      scannerRef.current = null;
      setIsScanning(false);

      setError(
        "Camera access failed. Please allow camera permission and try again."
      );
    }
  };

  const stopScanner = async () => {
    if (!scannerRef.current) {
      setIsScanning(false);
      return;
    }

    try {
      await scannerRef.current.stop();
      scannerRef.current.clear();
    } catch {}

    scannerRef.current = null;
    setIsScanning(false);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setScanResult(null);
    setVerification(null);

    try {
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
          scannerRef.current.clear();
        } catch {}

        scannerRef.current = null;
        setIsScanning(false);
      }

      const scanner = new Html5Qrcode("qr-reader");

      scannerRef.current = scanner;

      const decodedText = await scanner.scanFile(file, true);

      console.log("QR FROM IMAGE:", decodedText);

      setScanResult(decodedText);
      scannerRef.current = null;

      try {
        scanner.clear();
      } catch {}

      await verifyBatch(decodedText);
    } catch (err) {
      console.error("Image QR scan error:", err);

      scannerRef.current = null;

      setError(
        "No QR code was found in this image. Please upload a clear image containing the medicine QR code."
      );
    }

    event.target.value = "";
  };

  const scanAgain = async () => {
    setScanResult(null);
    setVerification(null);
    setError("");

    setTimeout(() => {
      startScanner();
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const isVerified = verification?.status === "VERIFIED";

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#101828]">
      {/* NAVBAR */}
      <nav className="border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A878]">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>

            <div className="text-[26px] font-bold tracking-tight">
              <span className="text-[#101828]">medi</span>
              <span className="text-[#F97316]">Sure</span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-[#475467] hover:text-[#00A878]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* CONTENT */}
      <section className="relative min-h-[calc(100vh-76px)] overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#ECFDF5] opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#ECFDF5] opacity-60 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
          {/* LEFT */}
          <div>
            <p className="text-sm font-bold tracking-[0.18em] text-[#00A878]">
              VERIFY MEDICINE
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Scan the
              <br />
              <span className="text-[#00A878]">QR code.</span>
            </h1>

            <p className="mt-5 max-w-md text-lg leading-8 text-[#667085]">
              Scan the QR code printed on the medicine package to verify its
              authenticity and trace its journey.
            </p>

            <div className="mt-8 rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-5">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#00A878]" />

                <div>
                  <p className="font-semibold">Your camera is safe</p>

                  <p className="mt-1 text-sm leading-6 text-[#667085]">
                    Camera access is used only for reading the medicine QR
                    code. No photo is stored.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full">
            <div className="overflow-hidden rounded-3xl border border-[#E4E7EC] bg-white shadow-xl shadow-[#101828]/10">
              {/* SCANNER */}
              <div className="relative bg-[#101828]">
                <div
                  id="qr-reader"
                  className="min-h-[430px] w-full"
                />

                {/* INITIAL */}
                {!isScanning && !scanResult && !isVerifying && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#101828] px-6 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
                      <QrCode className="h-10 w-10 text-white" />
                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-white">
                      Scan your medicine
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-[#98A2B3]">
                      Allow camera access and place the medicine QR code inside
                      the scanning frame.
                    </p>
                  </div>
                )}

                {/* SCANNING */}
                {isScanning && (
                  <>
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="relative h-[260px] w-[260px]">
                        <div className="absolute left-0 top-0 h-12 w-12 border-l-4 border-t-4 border-[#00A878]" />
                        <div className="absolute right-0 top-0 h-12 w-12 border-r-4 border-t-4 border-[#00A878]" />
                        <div className="absolute bottom-0 left-0 h-12 w-12 border-b-4 border-l-4 border-[#00A878]" />
                        <div className="absolute bottom-0 right-0 h-12 w-12 border-b-4 border-r-4 border-[#00A878]" />

                        <div className="absolute left-5 right-5 top-1/2 h-0.5 bg-[#00A878] shadow-[0_0_12px_#00A878]" />
                      </div>
                    </div>

                    <div className="absolute left-0 right-0 top-6 text-center">
                      <span className="rounded-full bg-black/60 px-4 py-2 text-xs font-medium text-white">
                        Place QR inside the frame
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={stopScanner}
                      className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* VERIFYING */}
                {isVerifying && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#101828] px-8 text-center">
                    <Loader2 className="h-14 w-14 animate-spin text-[#00A878]" />

                    <h2 className="mt-6 text-2xl font-bold text-white">
                      Verifying medicine...
                    </h2>

                    <p className="mt-2 text-sm text-[#98A2B3]">
                      Checking the medicine supply chain.
                    </p>
                  </div>
                )}

                {/* VERIFIED / SUSPICIOUS */}
                {verification && !isVerifying && (
                  <div className="absolute inset-0 overflow-y-auto bg-[#F8FAFC] p-5 text-left">
                    <div
                      className={`rounded-2xl border p-5 ${
                        isVerified
                          ? "border-[#A7F3D0] bg-[#ECFDF5]"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isVerified ? (
                          <CheckCircle2 className="h-10 w-10 text-[#00A878]" />
                        ) : (
                          <AlertTriangle className="h-10 w-10 text-red-500" />
                        )}

                        <div>
                          <p
                            className={`text-xl font-bold ${
                              isVerified
                                ? "text-[#008F68]"
                                : "text-red-600"
                            }`}
                          >
                            {isVerified ? "VERIFIED" : "SUSPICIOUS"}
                          </p>

                          <p className="text-sm text-[#667085]">
                            Batch: {verification.batch_id}
                          </p>
                        </div>
                      </div>
                    </div>
                    {history.length > 0 && (
  <div className="mt-4 rounded-2xl border border-[#E4E7EC] bg-white p-5">
    <div className="flex items-center justify-between">
      <p className="font-semibold text-[#101828]">
        Supply Chain History
      </p>

      <button
        type="button"
        onClick={() => setShowHistory((prev) => !prev)}
        className="text-sm font-semibold text-[#00A878] hover:text-[#008F68]"
      >
        {showHistory ? "Hide" : "View History"}
      </button>
    </div>

    {showHistory && (
      <div className="mt-5 space-y-4">
        {history.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 border-l-2 border-[#A7F3D0] pl-4"
          >
            <div>
              <p className="font-semibold text-[#101828]">
                {item.action}
              </p>

              {item.actor && (
                <p className="text-sm text-[#667085]">
                  Actor: {item.actor}
                </p>
              )}

              {item.from && item.to && (
                <p className="text-sm text-[#667085]">
                  {item.from} → {item.to}
                </p>
              )}

              {item.stage && (
                <p className="text-sm text-[#667085]">
                  Stage: {item.stage}
                </p>
              )}

              {item.timestamp && (
                <p className="mt-1 text-xs text-[#98A2B3]">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
                    <div className="mt-4 rounded-2xl border border-[#E4E7EC] bg-white p-5">
                      <p className="text-sm font-medium text-[#667085]">
                        Medicine
                      </p>

                      <p className="mt-1 text-lg font-bold">
                        {verification.medicine_name || "Unknown medicine"}
                      </p>

                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <p className="text-sm text-[#667085]">
                            Trust Score
                          </p>

                          <p className="text-3xl font-bold text-[#00A878]">
                            {verification.trust_score}/100
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-[#667085]">
                            Temperature
                          </p>

                          <p className="font-semibold">
                            {verification.temperature_status || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-[#E4E7EC] bg-white p-5">
                      <p className="font-semibold">Supply Chain</p>

                      <div className="mt-4 space-y-3 text-sm">
                        <StatusRow
                          label="Manufacturer"
                          value={verification.manufacturer}
                          verified={verification.manufacturer_verified}
                        />

                        <StatusRow
                          label="Distributor"
                          value={verification.distributor}
                          verified={verification.distributor_verified}
                        />

                        <StatusRow
                          label="Pharmacy"
                          value={verification.pharmacy}
                          verified={verification.pharmacy_verified}
                        />

                        <StatusRow
                          label="Blockchain"
                          value={
                            verification.blockchain_verified
                              ? "Verified"
                              : "Not Verified"
                          }
                          verified={verification.blockchain_verified}
                        />

                        <StatusRow
                          label="Cold Chain"
                          value={
                            verification.cold_chain_verified
                              ? "Safe"
                              : "Violation"
                          }
                          verified={verification.cold_chain_verified}
                        />
                      </div>
                    </div>

                    {verification.reasons &&
                      verification.reasons.length > 0 && (
                        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-5">
                          <p className="font-semibold text-red-700">
                            Verification Issues
                          </p>

                          <ul className="mt-3 space-y-2 text-sm text-red-600">
                            {verification.reasons.map((reason, index) => (
                              <li key={index}>• {reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                )}

                {/* RAW QR DETECTED BUT API NOT YET SHOWN */}
                {scanResult && !verification && !isVerifying && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#101828] px-8 text-center">
                    <CheckCircle2 className="h-16 w-16 text-[#00A878]" />

                    <h2 className="mt-5 text-2xl font-bold text-white">
                      QR Code Detected
                    </h2>

                    <p className="mt-3 max-w-md break-all text-sm text-[#98A2B3]">
                      {scanResult}
                    </p>
                  </div>
                )}
              </div>

              {/* CONTROLS */}
              <div className="p-6">
                {error && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {!isScanning && !scanResult && !isVerifying && (
                  <button
                    type="button"
                    onClick={startScanner}
                    className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#00A878] py-3.5 font-semibold text-white transition hover:bg-[#008F68]"
                  >
                    <QrCode className="h-5 w-5" />
                    Open Camera & Scan
                  </button>
                )}

                {!isScanning && !scanResult && !isVerifying && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#D0D5DD] bg-white py-3.5 font-semibold text-[#101828] transition hover:border-[#00A878] hover:text-[#00A878]"
                    >
                      <ImageIcon className="h-5 w-5" />
                      Upload QR Image
                    </button>
                  </>
                )}

                {isScanning && (
                  <button
                    type="button"
                    onClick={stopScanner}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D0D5DD] py-3.5 font-semibold text-[#101828] hover:border-[#00A878] hover:text-[#00A878]"
                  >
                    <X className="h-5 w-5" />
                    Stop Camera
                  </button>
                )}

                {(verification || scanResult) && !isVerifying && (
                  <button
                    type="button"
                    onClick={scanAgain}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A878] py-3.5 font-semibold text-white hover:bg-[#008F68]"
                  >
                    <QrCode className="h-5 w-5" />
                    Scan Another Medicine
                  </button>
                )}

                <p className="mt-4 text-center text-xs text-[#98A2B3]">
                  Camera is used only to scan the medicine QR code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatusRow({
  label,
  value,
  verified,
}: {
  label: string;
  value?: string | null;
  verified?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#F2F4F7] pb-3 last:border-0 last:pb-0">
      <div>
        <p className="font-medium text-[#101828]">{label}</p>
        <p className="text-xs text-[#667085]">
          {value || "Not available"}
        </p>
      </div>

      <div
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          verified
            ? "bg-[#ECFDF5] text-[#008F68]"
            : "bg-red-50 text-red-600"
        }`}
      >
        {verified ? "VERIFIED" : "NOT VERIFIED"}
      </div>
    </div>
  );
}