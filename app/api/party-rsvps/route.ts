import { NextResponse } from "next/server";
import { createPartyRsvp, listPartyRsvps } from "../../../lib/party-rsvps";

export const runtime = "nodejs";

const validParties = new Set(["bachelor", "bachelorette"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const party = typeof body.party === "string" ? body.party.trim().toLowerCase() : "";
    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";

    if (!validParties.has(party) || !firstName || !lastName || firstName.length > 80 || lastName.length > 80) {
      return NextResponse.json({ error: "Party, first name, and last name are required." }, { status: 400 });
    }

    const result = createPartyRsvp({
      party: party as "bachelor" | "bachelorette",
      firstName,
      lastName,
    });

    return NextResponse.json({ ok: true, id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save RSVP." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ rsvps: listPartyRsvps() });
}
