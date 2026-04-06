import { redis } from "@/lib/redis";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";
import { createHash } from "crypto";

export async function POST(req: Request) {
  try {
    const { encrypted, ttl, burn, label, api_key, vaultKey } = await req.json();
    const headersApiKey = req.headers.get("x-api-key");
    const tokenToVerify = api_key || headersApiKey;
    
    let userVaultKey = vaultKey || null; // Prioritize vaultKey from Dashboard


    if (tokenToVerify) {
        const tokenHash = createHash("sha256").update(tokenToVerify).digest("hex");
        const tokenQuery = query(collection(db, "api_tokens"), where("tokenHash", "==", tokenHash));
        const tokenSnapshot = await getDocs(tokenQuery);
        
        if (!tokenSnapshot.empty) {
          const tokenDoc = tokenSnapshot.docs[0];
          userVaultKey = tokenDoc.data().userId;
          // Update last used timestamp (async)
          updateDoc(tokenDoc.ref, { lastUsedAt: serverTimestamp() });
        }
    }

    if (!encrypted) {
      return NextResponse.json({ error: "Missing encrypted data" }, { status: 400 });
    }

    // Generate a unique short ID
    const id = crypto.randomUUID().slice(0, 8);
    
    // Map TTL values to seconds
    const ttlMap: Record<string, number> = {
      "10m": 10 * 60,
      "1h": 60 * 60,
      "24h": 24 * 60 * 60,
      "7d": 7 * 24 * 60 * 60,
      "30d": 30 * 24 * 60 * 60,
      "once": 24 * 60 * 60 
    };

    const ttlSeconds = ttlMap[ttl] || parseInt(ttl) * (ttl.includes('d') ? 86400 : 3600) || 24 * 3600;
    
    const secretData = {
      encrypted,
      burn: burn === true || ttl === "once",
      label: label || "Untitled Secret",
      createdAt: new Date().toISOString(),
      hits: 0,
    };

    // Store the secret
    await redis.set(`secret:${id}`, secretData, { ex: ttlSeconds });

    // Link to the user's vault (either from API key or session)
    if (userVaultKey) {
      await redis.sadd(`user:shares:${userVaultKey}`, id);
      await redis.expire(`user:shares:${userVaultKey}`, 60 * 60 * 24 * 30);
    }

    return NextResponse.json({ id });
  } catch (error: any) {
    console.error("Share error:", error.message || error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
