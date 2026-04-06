import { NextRequest, NextResponse } from "next/server";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL!;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;

async function redisGet(key: string): Promise<string | null> {
  const res = await fetch(`${REDIS_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    cache: "no-store",
  });
  const data = await res.json();
  return data.result ?? null;
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const email = req.nextUrl.searchParams.get("email");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const paidByUid = await redisGet(`paid:${userId}`);
    let paidByEmail = null;
    
    if (email) {
      paidByEmail = await redisGet(`paid_email:${email}`);
    }

    return NextResponse.json({ 
      paid: (paidByUid === "true" || paidByEmail === "true") 
    });
  } catch (err) {
    console.error("Payment verify error:", err);
    return NextResponse.json({ paid: false });
  }
}
