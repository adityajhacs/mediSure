"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    setLoading(true);

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password.");
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
  const role = String(data.user?.role || "").toLowerCase();

  if (role === "manufacturer") {
    router.push("/manufacturer/dashboard");
  } else if (role === "distributor") {
    router.push("/distributor/dashboard");
  } else if (role === "pharmacy") {
    router.push("/pharmacy/dashboard");
  } else {
    router.push("/");
  }
}, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#101828]">

      {/* ================= NAVBAR ================= */}
      <nav className="h-[76px] border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A878]">
              <ShieldCheck className="h-[21px] w-[21px] text-white" />
            </div>

            <div className="text-[26px] font-bold tracking-tight">
              <span className="text-[#101828]">medi</span>
              <span className="text-[#F97316]">Sure</span>
            </div>
          </Link>

          {/* BACK */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-[#475467] transition-colors hover:text-[#00A878]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <section className="relative min-h-[calc(100vh-76px)] overflow-hidden">

        {/* VERY SUBTLE BACKGROUND */}
        <div className="pointer-events-none absolute left-[-180px] top-[80px] h-[420px] w-[420px] rounded-full bg-[#ECFDF5] opacity-60 blur-[100px]" />

        <div className="pointer-events-none absolute bottom-[-180px] right-[-160px] h-[420px] w-[420px] rounded-full bg-[#ECFDF5] opacity-50 blur-[100px]" />

        {/* CONTENT */}
        <div className="relative mx-auto flex min-h-[calc(100vh-76px)] max-w-[1180px] items-center px-6 py-10">

          <div className="grid w-full items-center gap-16 lg:grid-cols-[1fr_470px]">

            {/* ================= LEFT SIDE ================= */}
            <div className="hidden lg:block">

              {/* BADGE */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-2 text-sm font-medium text-[#008F68]">
                <ShieldCheck className="h-4 w-4" />
                Welcome Back
              </div>

              {/* HEADING */}
              <h1 className="mt-7 text-[52px] font-bold leading-[1.08] tracking-tight text-[#101828]">

                Welcome back to
                <br />

                <span className="text-[#101828]">
                  medi<span className="text-[#F97316]">Sure</span>
                </span>

              </h1>

              {/* DESCRIPTION */}
              <p className="mt-6 max-w-[500px] text-[17px] leading-8 text-[#667085]">
                Sign in to access your account and continue building a safer,
                more transparent medicine supply chain.
              </p>

              {/* FEATURES */}
              <div className="mt-9 space-y-6">

                <LoginFeature
                  icon={LockKeyhole}
                  title="Secure Access"
                  text="Your account and organization data stay protected."
                />

                <LoginFeature
                  icon={ShieldCheck}
                  title="Trusted Platform"
                  text="Built for a safer and more transparent healthcare ecosystem."
                />

                <LoginFeature
                  icon={Users}
                  title="Make an Impact"
                  text="Help ensure safe and authentic medicines reach patients."
                />

              </div>

            </div>

            {/* ================= LOGIN CARD ================= */}
            <div className="w-full">

              <div className="rounded-[24px] border border-[#E4E7EC] bg-white px-7 py-8 shadow-[0_12px_35px_rgba(16,24,40,0.07)] md:px-9 md:py-9">

                {/* CARD HEADER */}
                <div className="text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFDF5]">
                    <ShieldCheck className="h-7 w-7 text-[#00A878]" />
                  </div>

                  <h2 className="mt-5 text-[30px] font-bold tracking-tight text-[#101828]">
                    Sign in
                  </h2>

                  <p className="mt-2 text-sm text-[#667085]">
                    Enter your credentials to continue.
                  </p>

                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                  {/* EMAIL */}
                  <div>

                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-[#101828]"
                    >
                      Email Address{" "}
                      <span className="text-[#EF4444]">*</span>
                    </label>

                    <div className="relative mt-2">

                      <Mail
                        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#98A2B3]"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@company.com"
                        className="h-[52px] w-full rounded-xl border border-[#D0D5DD] bg-white pl-11 pr-4 text-sm text-[#101828] outline-none transition-all placeholder:text-[#98A2B3] focus:border-[#00A878] focus:ring-4 focus:ring-[#ECFDF5]"
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}
                  <div>

                    <div className="flex items-center justify-between">

                      <label
                        htmlFor="password"
                        className="text-sm font-semibold text-[#101828]"
                      >
                        Password{" "}
                        <span className="text-[#EF4444]">*</span>
                      </label>

                      <button
                        type="button"
                        className="text-sm font-medium text-[#00A878] transition-colors hover:text-[#008F68]"
                      >
                        Forgot password?
                      </button>

                    </div>

                    <div className="relative mt-2">

                      <LockKeyhole
                        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#98A2B3]"
                      />

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Enter your password"
                        className="h-[52px] w-full rounded-xl border border-[#D0D5DD] bg-white pl-11 pr-12 text-sm text-[#101828] outline-none transition-all placeholder:text-[#98A2B3] focus:border-[#00A878] focus:ring-4 focus:ring-[#ECFDF5]"
                      />

                      <button
                        type="button"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() =>
                          setShowPassword((prev) => !prev)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] transition-colors hover:text-[#101828]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>

                    </div>

                                   </div>

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-3 text-sm font-medium text-[#008F68]">
                      {success}
                    </div>
                  )}

                  {/* SIGN IN */}
                  <button
  type="submit"
  disabled={loading}
  className="mt-2 h-[52px] w-full rounded-xl bg-[#00A878] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#008F68] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Signing In..." : "Sign In"}
</button>

                </form>

                {/* DIVIDER */}
                <div className="my-7 flex items-center gap-4">

                  <div className="h-px flex-1 bg-[#E4E7EC]" />

                  <span className="text-xs font-medium text-[#98A2B3]">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-[#E4E7EC]" />

                </div>

                {/* REGISTER */}
                <p className="text-center text-sm text-[#667085]">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-[#00A878] transition-colors hover:text-[#008F68]"
                  >
                    Create an account
                  </Link>
                </p>

              </div>

              {/* BOTTOM TEXT */}
              <p className="mt-4 text-center text-xs text-[#98A2B3]">
                Secure access to the mediSure medicine supply chain platform.
              </p>

            </div>

          </div>
        </div>
      </section>
    </main>
  );
}


/* ================= FEATURE ================= */

function LoginFeature({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5]">
        <Icon className="h-5 w-5 text-[#00A878]" />
      </div>

      <div>
        <h3 className="text-[15px] font-bold text-[#101828]">
          {title}
        </h3>

        <p className="mt-1 max-w-[430px] text-sm leading-6 text-[#667085]">
          {text}
        </p>
      </div>

    </div>
  );
}