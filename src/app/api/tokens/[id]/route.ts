import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Revoke the token immediately from Firestore
    await deleteDoc(doc(db, "api_tokens", id));

    return NextResponse.json({ success: true, msg: "Token revoked" });
  } catch (error: any) {
    console.error("Token revocation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
