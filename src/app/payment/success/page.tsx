"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle, Shield } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <main style={{
        minHeight: "100vh",
        background: "var(--background)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
      }}>
        <Loader2 size={56} color="#6366f1" />
      </main>
    }>
      <PaymentContent />
    </Suspense>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Wait for auth to load
    if (authLoading) return;

    const paymentId = searchParams.get("payment_id") || searchParams.get("paymentId");
    const userIdParam = searchParams.get("userId");

    // Use authenticated user's UID or fallback to query param
    const userId = user?.uid || userIdParam;

    if (!userId) {
      setStatus("error");
      return;
    }

    // Call backend to confirm and record the payment
    const confirmPayment = async () => {
      try {
        const res = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, paymentId }),
        });

        if (res.ok) {
          setStatus("success");
          // Start countdown to redirect to dashboard
          let count = 5;
          const interval = setInterval(() => {
            count--;
            setCountdown(count);
            if (count <= 0) {
              clearInterval(interval);
              router.push("/dashboard");
            }
          }, 1000);
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Failed to confirm payment:", err);
        setStatus("error");
      }
    };

    confirmPayment();
  }, [authLoading, user, searchParams, router]);

  return (
    <main style={{
      minHeight: "100vh",
      background: "var(--background)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      padding: "2rem",
    }}>
      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "-20%", left: "-10%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(100px)", zIndex: 0, pointerEvents: "none" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: "28px",
          padding: "3.5rem",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", color: "var(--foreground)", fontWeight: 800, fontSize: "1.1rem", marginBottom: "2.5rem" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #6366f1, #a855f7)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={18} color="white" />
          </div>
          envdrop
        </Link>

        {status === "loading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}
            >
              <Loader2 size={56} color="#6366f1" />
            </motion.div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.75rem" }}>
              Confirming Payment…
            </h1>
            <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
              We're verifying your payment and activating your account. This takes just a moment.
            </p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}
            >
              <div style={{ width: "80px", height: "80px", background: "rgba(5,150,105,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle size={48} color="#059669" />
              </div>
            </motion.div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--foreground)", marginBottom: "0.75rem", letterSpacing: "-0.03em" }}>
              Payment Successful! 🎉
            </h1>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
              Welcome to envdrop Studio. Your account is now fully activated. Redirecting you to your dashboard in <strong style={{ color: "var(--brand-primary)" }}>{countdown}s</strong>…
            </p>

            <div style={{ background: "var(--background)", borderRadius: "16px", padding: "1.25rem", border: "1px solid var(--border-color)", marginBottom: "1.5rem", textAlign: "left" }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>What's unlocked</div>
              {["Unlimited secret sharing", "7-day persistence", "Security audit logs", "API token access", "Priority support"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--foreground)", fontSize: "0.9rem", padding: "0.3rem 0" }}>
                  <CheckCircle size={14} color="#059669" />
                  {item}
                </div>
              ))}
            </div>

            <Link
              href="/dashboard"
              style={{
                display: "block", width: "100%", padding: "1rem",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                color: "white", borderRadius: "14px", fontWeight: 700,
                textDecoration: "none", fontSize: "1rem",
                boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
              }}
            >
              Go to Dashboard →
            </Link>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
              <div style={{ width: "80px", height: "80px", background: "rgba(239,68,68,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <XCircle size={48} color="#ef4444" />
              </div>
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--foreground)", marginBottom: "0.75rem" }}>
              Verification Failed
            </h1>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
              We couldn't confirm your payment automatically. Don't worry — if you were charged, contact us and we'll activate your account manually.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link href="/dashboard" style={{ display: "block", padding: "1rem", background: "var(--brand-primary)", color: "white", borderRadius: "14px", fontWeight: 700, textDecoration: "none" }}>
                Try Dashboard Access
              </Link>
              <Link href="/" style={{ display: "block", padding: "1rem", background: "var(--background)", color: "var(--foreground)", borderRadius: "14px", fontWeight: 600, textDecoration: "none", border: "1px solid var(--border-color)" }}>
                Back to Home
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
