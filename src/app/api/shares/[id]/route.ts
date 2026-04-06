import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vaultKey = req.headers.get("X-Vault-Key");

  if (!vaultKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify that this share belongs to the vaultKey
    const isOwner = await redis.sismember(`user:shares:${vaultKey}`, id);
    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized access to share" }, { status: 403 });
    }

    // Delete the secret and remove from user's shares set
    await redis.del(`secret:${id}`);
    await redis.srem(`user:shares:${vaultKey}`, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Dashboard delete error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
