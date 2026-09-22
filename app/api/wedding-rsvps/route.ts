import { NextResponse } from "next/server";
import { createWeddingRsvp, getWeddingRsvpCount } from "../../../lib/party-rsvps";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";

    if (!firstName || !lastName || firstName.length > 80 || lastName.length > 80) {
      return NextResponse.json({ error: "First name and last name are required." }, { status: 400 });
    }

    const result = createWeddingRsvp({ firstName, lastName });
    return NextResponse.json({ ok: true, id: result.id, count: getWeddingRsvpCount() }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save RSVP." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ count: getWeddingRsvpCount() });
}
