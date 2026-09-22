import { NextResponse } from "next/server";
import { saveGuestPhoto } from "@/lib/guest-photos";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please choose an image to upload." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are supported right now." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "Please keep photos under 15 MB." }, { status: 400 });
    }

    const photo = await saveGuestPhoto(file);
    return NextResponse.json({ photo });
  } catch (error) {
    console.error("Failed to upload guest photo", error);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
