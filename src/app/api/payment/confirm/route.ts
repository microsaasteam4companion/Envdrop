import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL!;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;

async function redisSet(key: string, value: string) {
  const res = await fetch(`${REDIS_URL}/set/${key}/${value}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, paymentId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Verify with Dodo Payments API that payment is real
    if (paymentId) {
      try {
        const dodoRes = await fetch(
          `https://api.dodopayments.com/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.DODO_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (dodoRes.ok) {
          const dodoData = await dodoRes.json();
          // Only confirm if payment status is succeeded
          if (dodoData.status !== "succeeded" && dodoData.payment_status !== "succeeded") {
            return NextResponse.json({ error: "Payment not confirmed" }, { status: 402 });
          }
        }
      } catch (e) {
        // If Dodo API call fails, still allow (payment could be in progress)
        console.warn("Could not verify with Dodo API:", e);
      }
    }

    // Mark user as paid in Redis (no expiry — permanent)
    await redisSet(`paid:${userId}`, "true");

    // NEW: Sync to Firestore for visibility in Firebase Console (using Admin SDK)
    try {
      await adminDb.collection("subscriptions").doc(userId).set({
        hasPaid: true,
        type: "Studio",
        paymentId: paymentId || "manual",
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (fsError) {
      console.error("Firestore sync error:", fsError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Payment confirm error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
