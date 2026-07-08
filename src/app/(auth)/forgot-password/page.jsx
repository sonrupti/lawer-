"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, KeyRound, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(data.message);

      // Redirect to OTP page for password reset flow
      setTimeout(() => {
        router.push(
          `/verify-otp?email=${encodeURIComponent(email)}&type=recovery&next=reset-password`
        );
      }, 2000);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass-card border border-border p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 border border-accent/20 mb-4">
            <KeyRound className="h-7 w-7 text-accent" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Forgot Password</h1>
          <p className="mt-1 text-sm text-text-muted">
            Enter your email and we&apos;ll send you a reset code
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3">
            <AlertCircle className="h-4 w-4 text-danger mt-0.5 shrink-0" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
            <p className="text-sm text-success">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full rounded-xl border border-border bg-surface/30 pl-10 pr-4 py-2.5 text-sm text-text placeholder-text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 text-sm tracking-wide transition-all duration-200 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Code"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
