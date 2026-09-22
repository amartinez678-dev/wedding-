import { NextResponse } from "next/server";
import { listGuestPhotos } from "@/lib/guest-photos";

export const runtime = "nodejs";

export async function GET() {
  try {
    const photos = await listGuestPhotos();
    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Failed to list guest photos", error);
    return NextResponse.json({ error: "Unable to load guest photos." }, { status: 500 });
  }
}
