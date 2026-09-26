import PartyInvite from "../../components/PartyInvite";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function BachelorPage() {
  const content = await getSiteContent();
  return <PartyInvite type="bachelor" copy={content.bachelor} />;
}
