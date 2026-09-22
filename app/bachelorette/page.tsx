import PartyInvite from "../../components/PartyInvite";

export default function BachelorettePage() {
  return (
    <PartyInvite
      type="bachelorette"
      title="Amber's Bachelorette Weekend"
      location="Palm Springs, California"
      dates="August 14–17, 2026"
      description="A golden weekend for Amber and her favorite people, filled with sunshine, dancing, and a little bit of sparkle."
      activities={["Poolside welcome drinks", "Girls' dinner under the stars", "Matching pajamas & late-night laughs", "Brunch, photos and a final toast"]}
    />
  );
}
