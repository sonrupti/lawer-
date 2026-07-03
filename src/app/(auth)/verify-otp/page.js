"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MailCheck, RefreshCw, AlertCircle, CheckCircle2, Loader2, ShieldAlert } from "lucide-react";

// Separated into a child component so Suspense can wrap it
function OTPVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const type = searchParams.get("type") || "signup";
  const next = searchParams.get("next") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const MAX_ATTEMPTS = 5;
  const inputRefs = useRef([]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index, value) => {
    // Accept only digits
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // keep only last digit
    setOtp(newOtp);
    setError("");

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits filled
    if (value && index === 5) {
      const fullOtp = [...newOtp.slice(0, 5), value.slice(-1)].join("");
      if (fullOtp.length === 6) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      handleVerify(pasted);
    }
  };

  const handleVerify = async (tokenOverride) => {
    const token = tokenOverride || otp.join("");
    if (token.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      setError("Too many failed attempts. Please request a new OTP.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, type }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAttempts((a) => a + 1);
        const remaining = MAX_ATTEMPTS - attempts - 1;
        setError(
          data.error + (remaining > 0 ? ` (${remaining} attempt${remaining !== 1 ? "s" : ""} remaining)` : "")
        );
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }

      setSuccess("Verified! Redirecting...");

      // Redirect based on type and language selection status
      setTimeout(() => {
        if (type === "recovery") {
          router.push("/reset-password");
        } else if (!data.hasSelectedLanguage) {
          router.push("/select-language");
        } else if (next) {
          router.push(`/${next}`);
        } else {
          router.push("/");
        }
      }, 800);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend OTP.");
        return;
      }

      setSuccess("A new OTP has been sent to your email.");
      setAttempts(0);
      setCanResend(false);
      setResendCooldown(30);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Network error. Could not resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  const isBlocked = attempts >= MAX_ATTEMPTS;

  return (
    <div className="w-full max-w-md">
      <div className="glass-card border border-border p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mb-4">
            {isBlocked ? (
              <ShieldAlert className="h-7 w-7 text-danger" />
            ) : (
              <MailCheck className="h-7 w-7 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">
            {type === "recovery" ? "Reset Password OTP" : "Verify Your Email"}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Enter the 6-digit code sent to{" "}
            <span className="font-semibold text-text">{email}</span>
          </p>
          <p className="mt-0.5 text-xs text-text-muted">OTP expires in 5 minutes</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3">
            <AlertCircle className="h-4 w-4 text-danger mt-0.5 shrink-0" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
            <p className="text-sm text-success">{success}</p>
          </div>
        )}

        {/* OTP Inputs */}
        <div className="flex items-center justify-center gap-3 mb-6" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              disabled={isVerifying || isBlocked}
              aria-label={`OTP digit ${idx + 1}`}
              className={`h-14 w-12 rounded-xl border text-center text-2xl font-bold text-text bg-surface/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40
                ${digit ? "border-primary bg-primary/5" : "border-border"}
                ${isBlocked ? "opacity-40 cursor-not-allowed" : ""}
              `}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={() => handleVerify()}
          disabled={isVerifying || isBlocked || otp.join("").length !== 6}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 text-sm tracking-wide transition-all duration-200 cursor-pointer mb-4"
        >
          {isVerifying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* Resend */}
        <div className="text-center">
          <p className="text-sm text-text-muted">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={!canResend || isResending || isBlocked}
              className="font-semibold text-primary hover:underline disabled:text-text-muted/60 disabled:no-underline disabled:cursor-not-allowed inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              {isResending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              {canResend ? "Resend OTP" : `Resend in ${resendCooldown}s`}
            </button>
          </p>
        </div>

        {/* Blocked message */}
        {isBlocked && (
          <p className="mt-4 text-center text-xs text-danger font-medium">
            Maximum attempts reached. Please go back and request a new OTP.
          </p>
        )}
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md">
        <div className="glass-card border border-border p-8 shadow-2xl flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    }>
      <OTPVerifyContent />
    </Suspense>
  );
}
