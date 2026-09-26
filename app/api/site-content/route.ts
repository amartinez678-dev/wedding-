import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "@/lib/site-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hasValidAdminKey(request: Request) {
  const adminKey = process.env.ADMIN_KEY;
  const providedKey = request.headers.get("x-admin-key") ?? "";

  if (!adminKey) return false;

  const expected = Buffer.from(adminKey);
  const provided = Buffer.from(providedKey);
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export async function GET() {
  return NextResponse.json(await getSiteContent(), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  if (!process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Site editing is not configured." }, { status: 503 });
  }

  if (!hasValidAdminKey(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const content = await saveSiteContent(await request.json());
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    console.error("Failed to save site content", error);
    return NextResponse.json({ error: "Unable to save site content." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Site editing is not configured." }, { status: 503 });
  }

  if (!hasValidAdminKey(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const payload = await request.json();
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid page content." }, { status: 400 });
    }

    const { section, content } = payload as { section?: unknown; content?: unknown };
    const sections = new Set(["home", "invite", "bachelor", "bachelorette"]);
    if (typeof section !== "string" || !sections.has(section)) {
      return NextResponse.json({ error: "Unknown page." }, { status: 400 });
    }

    const existingContent = await getSiteContent();
    const savedContent = await saveSiteContent({ ...existingContent, [section]: content });
    return NextResponse.json({ ok: true, content: savedContent });
  } catch (error) {
    console.error("Failed to save page content", error);
    return NextResponse.json({ error: "Unable to save page content." }, { status: 500 });
  }
}