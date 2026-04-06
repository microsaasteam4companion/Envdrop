import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const vaultKey = req.headers.get("X-Vault-Key");

  if (!vaultKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all share IDs for this user
    const shareIds = await redis.smembers(`user:shares:${vaultKey}`);
    
    if (!shareIds || shareIds.length === 0) {
      return NextResponse.json({ shares: [] });
    }

    // Fetch details for each share
    // We'll use a pipeline or multiple gets
    const shares = await Promise.all(
      shareIds.map(async (id) => {
        const data: any = await redis.get(`secret:${id}`);
        if (!data) return null;
        return {
          id,
          label: data.label,
          createdAt: data.createdAt,
          lastAccessedAt: data.lastAccessedAt,
          hits: data.hits || 0,
          burn: data.burn,
          ttl: await redis.ttl(`secret:${id}`),
          accessLogs: data.accessLogs || [],
        };
      })
    );

    // Filter out expired/null shares and sort by date
    const activeShares = shares
      .filter((s) => s !== null)
      .sort((a, b) => new Date(b!.createdAt).getTime() - new Date(a!.createdAt).getTime());

    return NextResponse.json({ shares: activeShares });
  } catch (error) {
    console.error("Dashboard list error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
