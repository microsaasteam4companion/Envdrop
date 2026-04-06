import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const { userId, label } = await req.json();

    if (!userId || !label) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a secure random token
    // sk_ed_ (Secret Key EnvDrop) + 32 random characters
    const rawToken = `sk_ed_${randomBytes(24).toString("hex")}`;
    
    // Hash the token for secure storage
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    // Store the token metadata in Firestore
    const tokenRef = await addDoc(collection(db, "api_tokens"), {
      userId,
      tokenHash,
      label,
      token: rawToken, // Store RAW for persistent access
      createdAt: serverTimestamp(),
      lastUsedAt: null,
      mask: `sk_ed_****${rawToken.slice(-4)}`
    });

    // Return the RAW token ONLY ONCE
    return NextResponse.json({ 
      id: tokenRef.id,
      token: rawToken,
      msg: "Keep this key safe! You will not be able to see it again."
    });

  } catch (error: any) {
    console.error("Token generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
