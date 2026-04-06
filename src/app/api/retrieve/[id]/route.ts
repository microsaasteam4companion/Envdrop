import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const data: any = await redis.get(`secret:${id}`);

    if (!data) {
      return NextResponse.json({ error: "Secret not found or expired" }, { status: 404 });
    }

    // Get IP and User-Agent for Analytics
    const ip = request.headers.get('x-forwarded-for') || "127.0.0.1";
    const userAgent = request.headers.get('user-agent') || "Unknown";
    
    // Log Activity
    const newLog = { ip, userAgent, timestamp: new Date().toISOString() };
    data.accessLogs = [newLog, ...(data.accessLogs || [])].slice(0, 50); // Keep last 50 logs
    data.hits = (data.hits || 0) + 1;
    data.lastAccessedAt = newLog.timestamp;

    await redis.set(`secret:${id}`, data, { keepTtl: true });

    // If burn after reading is enabled, delete it
    if (data.burn) {
      await redis.del(`secret:${id}`);
    }

    return NextResponse.json({ 
      encrypted: data.encrypted,
      label: data.label,
      createdAt: data.createdAt
    });
  } catch (error) {
    console.error("Redis retrieval error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
