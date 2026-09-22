"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import WeddingLoader from "./WeddingLoader";

type PartyInviteProps = {
  type: "bachelor" | "bachelorette";
  title: string;
  location: string;
  dates: string;
  description: string;
  activities: string[];
};

export default function PartyInvite({ type, title, location, dates, description, activities }: PartyInviteProps) {
  const [showLoader, setShowLoader] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const isBachelorette = type === "bachelorette";

  async function handleRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setRsvpMessage("");

    try {
      const response = await fetch("/api/party-rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ party: type, firstName, lastName }),
      });

      if (!response.ok) {
        throw new Error("Unable to save RSVP");
      }

      setRsvpMessage("You are on the list. We cannot wait to celebrate with you.");
      setFirstName("");
      setLastName("");
      setShowLoader(true);
      window.setTimeout(() => {
        setShowLoader(false);
        setShowRsvp(false);
      }, 1400);
    } catch {
      setRsvpMessage("We could not save that just now. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className={`party-page party-${type}`}>
      <section className="party-hero">
        <video className="party-hero-video" autoPlay muted loop playsInline aria-hidden="true">
          <source src="/intro-video.mp4" type="video/mp4" />
        </video>
        <div className="party-hero-shade" aria-hidden="true" />
        <div className="party-orbit party-orbit-one" aria-hidden="true" />
        <div className="party-orbit party-orbit-two" aria-hidden="true" />
        <div className="party-hero-top"><span>{isBachelorette ? "B / 2026" : "A / 2026"}</span><span>Private weekend invite</span></div>
        <div className="party-hero-copy">
          <p className="party-kicker">{isBachelorette ? "The bride's last disco" : "The groom's final fling"}</p>
          <h1>{title}</h1>
          <p className="party-hero-date">{location} <span>·</span> {dates}</p>
        </div>
        <div className="party-hero-bottom"><span>{isBachelorette ? "Girls only" : "The boys"}</span><span>Scroll for details ↓</span></div>
      </section>

      <section className="party-intro">
        <div><p className="party-label">You are invited</p><h2>{description}</h2></div>
        <div className="party-intro-note"><p>Pack light, bring your best stories, and get ready for a weekend that deserves its own group chat.</p><p className="party-script">See you there.</p></div>
      </section>

      <section className="party-info-grid" aria-label="Party details">
        <div className="party-info-card party-info-main"><p className="party-label">Where we are going</p><h2>{location}</h2><p>{dates}</p><p className="party-muted">The full address, arrival details, and room assignments will be shared in the group chat.</p></div>
        <div className="party-info-card party-info-accent"><p className="party-label">The mood</p><h2>{isBachelorette ? "Pink skies & late nights" : "Desert air & good times"}</h2><p>{isBachelorette ? "Poolside afternoons, dinner reservations, matching pajamas, and dancing until we lose track of time." : "A weekend of open roads, cold drinks, competitive games, and one very happy groom."}</p></div>
      </section>

      <section className="party-itinerary">
        <div><p className="party-label">On the agenda</p><h2>A weekend worth remembering.</h2></div>
        <div className="party-activity-list">{activities.map((activity, index) => <div className="party-activity" key={activity}><span>0{index + 1}</span><h3>{activity}</h3><b>↗</b></div>)}</div>
      </section>

      <section className="party-rsvp">
        <div><p className="party-label">RSVP</p><h2>Count yourself in.</h2><p>Let us know if you can make it so we can lock in the plans, rooms, and reservations.</p></div>
        <button type="button" onClick={() => { setRsvpMessage(""); setShowRsvp(true); }}>RSVP now <span>↗</span></button>
      </section>

      <footer className="party-footer"><p className="party-script">Made for the memories.</p><p>{isBachelorette ? "AMBER'S CREW" : "ALEX'S CREW"}</p></footer>

      {showRsvp ? (
        <div className="party-rsvp-dialog" role="dialog" aria-modal="true" aria-labelledby="party-rsvp-title">
          <div className="party-rsvp-panel">
            <button type="button" className="party-dialog-close" onClick={() => setShowRsvp(false)} aria-label="Close RSVP form">Close</button>
            <p className="party-label">{isBachelorette ? "Amber's bachelorette" : "Alex's bachelor"}</p>
            <h2 id="party-rsvp-title">Save your place.</h2>
            <p>Tell us who is joining the weekend.</p>
            <form onSubmit={handleRsvp} className="party-rsvp-form">
              <label>First name<input required value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" /></label>
              <label>Last name<input required value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" /></label>
              <button type="submit" disabled={saving}>{saving ? "Saving..." : "Confirm RSVP"}</button>
            </form>
            {rsvpMessage ? <p className="party-rsvp-message" role="status">{rsvpMessage}</p> : null}
          </div>
        </div>
      ) : null}

      {showLoader ? <div className="invite-loader-overlay" aria-live="polite"><WeddingLoader size={210} text="Opening party details..." /></div> : null}
    </main>
  );
}
