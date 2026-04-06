import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL!;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;

async function redisSet(key: string, value: string) {
  await fetch(`${REDIS_URL}/set/${key}/${value}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
}

// Dodo Payments webhook handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Dodo webhook received:", JSON.stringify(body));

    const eventType = body.type || body.event_type;

    // Handle payment success events
    if (
      eventType === "payment.succeeded" ||
      eventType === "subscription.active" ||
      eventType === "payment_intent.succeeded"
    ) {
      // Extract userId from metadata or customer info
      const metadata = body.data?.metadata || body.metadata || {};
      const userId = metadata.userId || metadata.user_id;
      const customerEmail = body.data?.customer?.email || body.customer?.email;

      if (userId) {
        await redisSet(`paid:${userId}`, "true");
        console.log(`✅ Marked user ${userId} as paid via webhook`);
        
        // Sync to Firestore using Admin SDK
        try {
          await adminDb.collection("subscriptions").doc(userId).set({
            hasPaid: true,
            type: "Studio",
            email: customerEmail || "",
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (fsError) {
          console.error("Firestore sync error (UID):", fsError);
        }
      }

      // Also store by email if available (fallback lookup)
      if (customerEmail) {
        await redisSet(`paid_email:${customerEmail}`, "true");
        console.log(`✅ Marked email ${customerEmail} as paid via webhook`);
        
        // Sync to Firestore (using email as ID for easier lookup in console) - Admin SDK
        try {
          const emailDocId = `email_${customerEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
          await adminDb.collection("subscriptions").doc(emailDocId).set({
            hasPaid: true,
            type: "Studio",
            email: customerEmail,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (fsError) {
          console.error("Firestore sync error (Email):", fsError);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
