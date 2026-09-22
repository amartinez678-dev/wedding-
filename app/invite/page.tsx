"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import WeddingLoader from "../../components/WeddingLoader";

const weddingDate = new Date("2027-06-26T17:00:00-07:00");

const schedule = [
  { time: "12:30 PM", title: "Guest arrival", detail: "Find your seat at St. Monica before the ceremony begins." },
  { time: "1:00 PM", title: "The ceremony", detail: "Join us as we say yes to forever." },
  { time: "4:00 PM", title: "Cocktail hour", detail: "Drinks, small bites, and time to gather at Santa Monica Proper Hotel." },
  { time: "5:00 PM", title: "Dinner & dancing", detail: "An evening of good food, music, and celebration until 10:00 PM." },
];

function getCountdown() {
  const difference = Math.max(0, weddingDate.getTime() - Date.now());
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function Countdown() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setCountdown(getCountdown());
    const interval = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="invite-countdown" aria-label="Countdown to the wedding">
      {Object.entries(countdown).map(([label, value]) => (
        <div className="countdown-unit" key={label}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function InvitePage() {
  const [showLoader, setShowLoader] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpCount, setRsvpCount] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  function openRsvp() {
    setShowLoader(true);
    setRsvpMessage("");
    window.setTimeout(() => {
      setShowLoader(false);
      setShowRsvp(true);
    }, 4200);
  }

  async function saveRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setRsvpMessage("");

    try {
      const response = await fetch("/api/wedding-rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to save RSVP");

      setRsvpCount(result.count);
      setRsvpMessage("You are on the list. We cannot wait to celebrate with you.");
      setFirstName("");
      setLastName("");
    } catch {
      setRsvpMessage("We could not save your RSVP just now. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="invite-page">
      <header className="invite-hero">
        <video className="invite-hero-video" autoPlay muted loop playsInline aria-hidden="true">
          <source src="/intro-video.mp4" type="video/mp4" />
        </video>
        <div className="invite-hero-shade" aria-hidden="true" />
        <div className="invite-hero-top">
          <span>AA / 2027</span>
          <span>Los Angeles, California</span>
        </div>
        <div className="invite-hero-content">
          <p className="invite-kicker">The wedding celebration of</p>
          <h1>Amber <i>&amp;</i> Alex</h1>
          <p className="invite-date">Saturday · June 26 · 2027</p>
          <span className="invite-hero-stamp">Save<br />the<br />date</span>
        </div>
        <div className="invite-hero-bottom">
          <span>Formal invitation</span>
          <span className="hero-scroll">Scroll to explore ↓</span>
        </div>
      </header>

      <section className="invite-countdown-section">
        <div>
          <p className="invite-section-label">Counting down to forever</p>
          <h2>See you in the summer.</h2>
        </div>
        <Countdown />
      </section>

      <section className="invite-intro" aria-labelledby="invite-heading">
        <div>
          <p className="invite-section-label">Formal invitation</p>
          <h2 id="invite-heading">Together with their families, Amber and Alex invite you to celebrate their marriage.</h2>
        </div>
        <div className="invite-intro-copy">
          <p>We cannot imagine this day without the people who have shaped our story. Please join us for an evening of dinner, dancing, and all the people we love most.</p>
          <p className="invite-signoff">With love, A + A</p>
        </div>
      </section>

      <section className="invite-feature-grid" aria-label="Wedding details">
        <div className="invite-feature-image invite-feature-image-one">
          <img src="https://stmonica.net/images/banners/6328-31AA-3220244994-O.66b05d.jpg" alt="St. Monica Catholic Church in Santa Monica" />
          <span>01 / The ceremony</span>
        </div>
        <div className="invite-detail-block">
          <p className="invite-section-label">Ceremony</p>
          <h2>St. Monica Catholic Church</h2>
          <p>1:00 PM</p>
          <p>725 California Avenue</p>
          <p>Santa Monica, CA 90403</p>
          <p><a className="venue-map-link" href="https://www.google.com/maps/search/?api=1&query=St.+Monica+Catholic+Community+725+California+Avenue+Santa+Monica+CA+90403" target="_blank" rel="noreferrer">View directions ↗</a></p>
          <p>Saturday, June 26, 2027</p>
          <p className="invite-muted">Please arrive a little early for the ceremony.</p>
        </div>
        <div className="invite-detail-block invite-detail-accent">
          <p className="invite-section-label">Reception</p>
          <h2>Santa Monica Proper Hotel</h2>
          <p>700 Wilshire Boulevard</p>
          <p>Santa Monica, CA 90401</p>
          <p>4:00–10:00 PM</p>
          <p>Cocktail hour: 4:00–5:00 PM</p>
          <p><a className="venue-map-link" href="https://www.google.com/maps/search/?api=1&query=Santa+Monica+Proper+Hotel+700+Wilshire+Boulevard+Santa+Monica+CA+90401" target="_blank" rel="noreferrer">View directions ↗</a></p>
          <span className="feature-mark">A + A</span>
        </div>
        <div className="invite-feature-image invite-feature-image-two">
          <img src="https://www.properhotel.com/wp-content/uploads/2025/04/SMP_5-3_Ballroom_8-1024x614.jpg.webp" alt="Santa Monica Proper Hotel reception ballroom" />
          <span>02 / The reception</span>
        </div>
      </section>

      <section className="invite-schedule" aria-labelledby="schedule-heading">
        <div className="invite-section-heading">
          <p className="invite-section-label">The evening</p>
          <h2 id="schedule-heading">A little glimpse of the day</h2>
        </div>
        <div className="schedule-list">
          {schedule.map((item) => (
            <div className="schedule-item" key={item.time}>
              <time>{item.time}</time>
              <div><h3>{item.title}</h3><p>{item.detail}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="invite-planning" aria-label="Guest planning information">
        <div>
          <p className="invite-section-label">For your weekend</p>
          <h2>Make a little escape of it.</h2>
          <p>We are gathering hotel, transportation, and local recommendations so your time in Los Angeles feels easy from arrival to farewell.</p>
        </div>
        <div className="planning-links">
          <a href="mailto:amberandalex@example.com?subject=Wedding%20question">Ask a question <span>↗</span></a>
          <a href="https://www.google.com/maps/search/Los+Angeles,+California" target="_blank" rel="noreferrer">Explore Los Angeles <span>↗</span></a>
          <a href="tel:+13108679141">Zelle · (310) 867-9141 <span>↗</span></a>
          <a href="https://venmo.com/u/5622407587" target="_blank" rel="noreferrer">Venmo · Amber · (562) 240-7587 <span>↗</span></a>
        </div>
      </section>

      <section className="invite-rsvp" aria-labelledby="rsvp-heading">
        <div>
          <p className="invite-section-label">Please reply</p>
          <h2 id="rsvp-heading">We hope you can be there.</h2>
          <p>Kindly respond by May 1, 2027. A formal RSVP link will be included with your invitation.</p>
        </div>
        <button type="button" onClick={openRsvp}>Save your place <span>↗</span></button>
      </section>

      <footer className="invite-footer">
        <p className="script-font">With love, Amber &amp; Alex</p>
        <p>JUNE 26 · LOS ANGELES</p>
      </footer>

      {showLoader ? <div className="invite-loader-overlay" aria-live="polite"><WeddingLoader size={210} text="Opening your invitation..." /></div> : null}

      {showRsvp ? (
        <div className="wedding-rsvp-dialog" role="dialog" aria-modal="true" aria-labelledby="wedding-rsvp-title">
          <div className="wedding-rsvp-panel">
            <button type="button" className="wedding-dialog-close" onClick={() => setShowRsvp(false)} aria-label="Close RSVP form">Close</button>
            <p className="invite-section-label">Please reply</p>
            <h2 id="wedding-rsvp-title">Who is joining us?</h2>
            <p className="wedding-rsvp-copy">Enter your first and last name to save your place at the wedding.</p>
            <form onSubmit={saveRsvp} className="wedding-rsvp-form">
              <label>First name<input required value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" /></label>
              <label>Last name<input required value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" /></label>
              <button type="submit" disabled={saving}>{saving ? "Saving..." : "Confirm RSVP"}</button>
            </form>
            {rsvpMessage ? <p className="wedding-rsvp-message" role="status">{rsvpMessage}</p> : null}
            {rsvpCount !== null ? <p className="wedding-rsvp-count">{rsvpCount} guest{rsvpCount === 1 ? "" : "s"} on the list</p> : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
