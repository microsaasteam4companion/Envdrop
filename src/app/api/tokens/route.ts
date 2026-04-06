import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log(`[API] Fetching tokens for userId: ${userId}`);
    const q = query(
      collection(db, "api_tokens"), 
      where("userId", "==", userId)
    );
    
    const snapshot = await getDocs(q);
    console.log(`[API] Found ${snapshot.size} tokens`);

    const tokens = snapshot.docs.map(doc => {
      const data = doc.data();
      // Robust date handling
      let createdDate = new Date();
      if (data.createdAt && typeof data.createdAt.toDate === 'function') {
        createdDate = data.createdAt.toDate();
      } else if (data.createdAt) {
        createdDate = new Date(data.createdAt);
      }

      return {
        id: doc.id,
        label: data.label || "Untitled Key",
        token: data.token, // Raw token for persistent access
        createdAt: createdDate.toISOString(),
        lastUsedAt: data.lastUsedAt?.toDate?.()?.toISOString() || null,
        mask: data.mask || "****"
      };
    }).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ tokens });
  } catch (err: any) {
    console.error("Token fetch error details:", err.message);
    return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
  }
}
