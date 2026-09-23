"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Factory,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Store,
  Truck,
  User,
} from "lucide-react";

type Portal = "Manufacturer" | "Distributor" | "Pharmacy";

export default function RegisterPage() {
  const [portal, setPortal] = useState<Portal>("Manufacturer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  const formData = new FormData(e.currentTarget);

  const full_name = String(formData.get("full_name") || "").trim();
  const organization = String(formData.get("organization") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const confirm_password = String(
    formData.get("confirm_password") || ""
  );

  if (password !== confirm_password) {
    setError("Passwords do not match.");
    return;
  }

  if (password.length < 8) {
    setError("Password must be at least 8 characters.");
    return;
  }

  setLoading(true);

  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name,
        organization,
        email,
        password,
        role: portal.toUpperCase(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Registration failed.");
    }

    setSuccess("Registration successful! Redirecting to login...");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  const formData = new FormData(e.currentTarget);

  const full_name = String(formData.get("full_name") || "").trim();
  const organization = String(formData.get("organization") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const confirm_password = String(
    formData.get("confirm_password") || ""
  );

  if (password !== confirm_password) {
    setError("Passwords do not match.");
    return;
  }

  if (password.length < 8) {
    setError("Password must be at least 8 characters.");
    return;
  }

  setLoading(true);

  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    // ================= REGISTER =================

    const registerResponse = await fetch(
      `${API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name,
          organization,
          email,
          password,
          role: portal.toUpperCase(),
        }),
      }
    );

    const registerData = await registerResponse.json();

    if (!registerResponse.ok) {
      throw new Error(
        registerData.detail || "Registration failed."
      );
    }

    setSuccess(
      "Registration successful! Signing you in..."
    );

    // ================= AUTO LOGIN =================

    const loginResponse = await fetch(
      `${API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      throw new Error(
        loginData.detail ||
          "Registration successful, but automatic login failed."
      );
    }

    // ================= SAVE SESSION =================

    localStorage.setItem(
      "access_token",
      loginData.access_token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(loginData.user)
    );

    // ================= ROLE REDIRECT =================

    const role = String(
      loginData.user?.role || ""
    ).toLowerCase();

    setTimeout(() => {
      if (role === "manufacturer") {
        router.push("/manufacturer/dashboard");
      } else if (role === "distributor") {
        router.push("/distributor/dashboard");
      } else if (role === "pharmacy") {
        router.push("/pharmacy/dashboard");
      } else {
        router.push("/");
      }
    }, 800);
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
  const portals = [
    {
      name: "Manufacturer" as Portal,
      icon: Factory,
      description: "Create and manage medicine batches",
    },
    {
      name: "Distributor" as Portal,
      icon: Truck,
      description: "Track medicine shipments",
    },
    {
      name: "Pharmacy" as Portal,
      icon: Store,
      description: "Receive and verify medicines",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC]">

      {/* NAVBAR */}
      <nav className="border-b border-[#E4E7EC] bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00A878]">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>

            <div className="text-2xl font-bold tracking-tight">
              <span className="text-[#101828]">medi</span>
              <span className="text-[#F97316]">Sure</span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-[#475467] transition hover:text-[#00A878]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">

        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">

          {/* LEFT INFORMATION */}
          <div className="hidden pt-10 lg:block">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-4 py-2 text-sm font-semibold text-[#008F68]">
              <ShieldCheck className="h-4 w-4" />
              Join the trusted medicine network
            </div>

            <h1 className="mt-7 text-5xl font-bold leading-tight tracking-tight text-[#101828]">
              Create your
              <br />
              <span className="text-[#101828]">medi</span>
              <span className="text-[#F97316]">Sure</span>{" "}
              account
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-[#475467]">
              Join as a manufacturer, distributor, or pharmacy and be part of
              a safer, more transparent medicine supply chain.
            </p>

            <div className="mt-10 space-y-6">

              <InfoItem
                icon={Truck}
                title="Trusted Supply Chain"
                text="Secure and transparent medicine tracking"
              />

              <InfoItem
                icon={ShieldCheck}
                title="Blockchain Powered"
                text="Tamper-resistant and verifiable records"
              />

              <InfoItem
                icon={User}
                title="Role-Based Access"
                text="Dedicated portals for manufacturers, distributors, and pharmacies"
              />

            </div>
          </div>

          {/* REGISTER CARD */}
          <div className="rounded-3xl border border-[#E4E7EC] bg-white p-7 shadow-lg shadow-[#101828]/5 md:p-10">

            {/* CARD HEADER */}
            <div>
              <p className="text-sm font-bold tracking-wider text-[#00A878]">
                GET STARTED
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#101828] md:text-4xl">
                Create your{" "}
                <span className="text-[#101828]">
                  medi<span className="text-[#F97316]">Sure</span>
                </span>{" "}
                account
              </h2>

              <p className="mt-3 text-[#475467]">
                Choose your organization type and fill in the details below.
              </p>
            </div>

            {/* PORTAL */}
            <div className="mt-8">

              <label className="text-sm font-semibold text-[#101828]">
                Select your portal{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="mt-4 grid gap-4 md:grid-cols-3">

                {portals.map((item) => {
                  const Icon = item.icon;
                  const active = portal === item.name;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setPortal(item.name)}
                      className={`relative rounded-2xl border p-5 text-left transition-all duration-300 ${
                        active
                          ? "border-[#00A878] bg-[#ECFDF5] shadow-sm"
                          : "border-[#E4E7EC] bg-white hover:border-[#A7F3D0] hover:shadow-sm"
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                            active
                              ? "bg-[#00A878] text-white"
                              : "bg-[#ECFDF5] text-[#00A878]"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            active
                              ? "border-[#00A878] bg-[#00A878]"
                              : "border-[#98A2B3]"
                          }`}
                        >
                          {active && (
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>

                      <h3 className="mt-5 font-bold text-[#101828]">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-[#667085]">
                        {item.description}
                      </p>

                    </button>
                  );
                })}

              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">

              {/* NAME + ORGANIZATION */}
              <div className="grid gap-5 md:grid-cols-2">

              <FormField
  label="Full Name"
  required
  icon={User}
  placeholder="Your full name"
  type="text"
  name="full_name"
/>

                <FormField
  label="Organization Name"
  required
  icon={Building2}
  placeholder="Company / Pharmacy name"
  type="text"
  name="organization"
/>

              </div>

              {/* EMAIL */}
             <FormField
  label="Email Address"
  required
  icon={Mail}
  placeholder="you@company.com"
  type="email"
  name="email"
/>

              {/* PASSWORDS */}
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="text-sm font-semibold text-[#101828]">
                    Password <span className="text-red-500">*</span>
                  </label>

                  <div className="relative mt-2">

                    <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#98A2B3]" />

                   <input
  name="password"
  type={showPassword ? "text" : "password"}
  required
  placeholder="Create password"
  className="h-12 w-full rounded-xl border border-[#D0D5DD] pl-11 pr-12 text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#00A878] focus:ring-4 focus:ring-[#ECFDF5]"
/>

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#101828]"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>

                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-[#101828]">
                    Confirm Password{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative mt-2">

                    <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#98A2B3]" />

                    <input
  name="confirm_password"
  type={showConfirmPassword ? "text" : "password"}
  required
  placeholder="Confirm password"
  className="h-12 w-full rounded-xl border border-[#D0D5DD] pl-11 pr-12 text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#00A878] focus:ring-4 focus:ring-[#ECFDF5]"
/>

<button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#101828]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>

                  </div>
                </div>

              </div>

              {/* PASSWORD INFO */}
              <p className="text-sm text-[#667085]">
                Password must be at least 8 characters with a mix of letters,
                numbers and symbols.
              </p>
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
            {/* BUTTON */}
<button
  type="submit"
  disabled={loading}
  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#00A878] px-6 font-semibold text-white shadow-sm transition hover:bg-[#008F68] disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Creating Account..." : `Create ${portal} Account`}
  {!loading && <ArrowRight className="h-5 w-5" />}
</button> 

            </form>

            {/* SIGN IN */}
            <div className="my-7 border-t border-[#E4E7EC]" />

            <p className="text-center text-sm text-[#667085]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#00A878] hover:text-[#008F68]"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </section>
    </main>
  );
}

/* INFO ITEM */

function InfoItem({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5]">
        <Icon className="h-6 w-6 text-[#00A878]" />
      </div>

      <div>
        <h3 className="font-bold text-[#101828]">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-[#667085]">
          {text}
        </p>
      </div>

    </div>
  );
}

/* FORM FIELD */

function FormField({
  label,
  required,
  icon: Icon,
  placeholder,
  type,
  name,
}: {
  label: string;
  required?: boolean;
  icon: React.ElementType;
  placeholder: string;
  type: string;
  name: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#101828]">
        {label}{" "}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative mt-2">

        <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#98A2B3]" />

        <input
  name={name}
  type={type}
  required={required}
  placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-[#D0D5DD] pl-11 pr-4 text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#00A878] focus:ring-4 focus:ring-[#ECFDF5]"
        />

      </div>
    </div>
  );
}