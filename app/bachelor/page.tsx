import PartyInvite from "../../components/PartyInvite";

export default function BachelorPage() {
  return (
    <PartyInvite
      type="bachelor"
      title="Alex's Bachelor Weekend"
      location="Joshua Tree, California"
      dates="September 4–6, 2026"
      description="A private weekend for Alex and the people who have been there for every chapter."
      activities={["Arrival drinks & desert sunset", "Open-road day trip", "Dinner, games & stories", "Slow morning and farewell brunch"]}
    />
  );
}
