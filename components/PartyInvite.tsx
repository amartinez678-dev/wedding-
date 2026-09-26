"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import WeddingLoader from "./WeddingLoader";
import type { EditableText } from "@/lib/site-content-defaults";
import PageContentEditor from "./PageContentEditor";

type PartyInviteProps = {
  type: "bachelor" | "bachelorette";
  copy: EditableText;
};

export default function PartyInvite({ type, copy }: PartyInviteProps) {
  const [pageCopy, setPageCopy] = useState(copy);
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

      setRsvpMessage(pageCopy.successMessage);
      setFirstName("");
      setLastName("");
      setShowLoader(true);
      window.setTimeout(() => {
        setShowLoader(false);
        setShowRsvp(false);
      }, 1400);
    } catch {
      setRsvpMessage(pageCopy.errorMessage);
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
        <div className="party-hero-top"><span>{pageCopy.heroEyebrow}</span><span>{pageCopy.heroTopLabel}</span></div>
        <div className="party-hero-copy">
          <p className="party-kicker">{pageCopy.heroKicker}</p>
          <h1>{pageCopy.title}</h1>
          <p className="party-hero-date">{pageCopy.location} <span>·</span> {pageCopy.dates}</p>
        </div>
        <div className="party-hero-bottom"><span>{pageCopy.heroFooter}</span><span>{pageCopy.scrollLabel}</span></div>
      </section>

      <section className="party-intro">
        <div><p className="party-label">{pageCopy.introLabel}</p><h2>{pageCopy.description}</h2></div>
        <div className="party-intro-note"><p>{pageCopy.introCopy}</p><p className="party-script">{pageCopy.introSignoff}</p></div>
      </section>

      <section className="party-info-grid" aria-label="Party details">
        <div className="party-info-card party-info-main"><p className="party-label">{pageCopy.destinationLabel}</p><h2>{pageCopy.location}</h2><p>{pageCopy.dates}</p><p className="party-muted">{pageCopy.destinationNote}</p></div>
        <div className="party-info-card party-info-accent"><p className="party-label">{pageCopy.moodLabel}</p><h2>{pageCopy.moodHeading}</h2><p>{pageCopy.moodCopy}</p></div>
      </section>

      <section className="party-itinerary">
        <div><p className="party-label">{pageCopy.itineraryLabel}</p><h2>{pageCopy.itineraryHeading}</h2></div>
        <div className="party-activity-list">{[1, 2, 3, 4].map((number) => <div className="party-activity" key={number}><span>0{number}</span><h3>{pageCopy[`activity${number}`]}</h3><b>↗</b></div>)}</div>
      </section>

      <section className="party-rsvp">
        <div><p className="party-label">{pageCopy.rsvpLabel}</p><h2>{pageCopy.rsvpHeading}</h2><p>{pageCopy.rsvpCopy}</p></div>
        <button type="button" onClick={() => { setRsvpMessage(""); setShowRsvp(true); }}>{pageCopy.rsvpButtonLabel} <span>↗</span></button>
      </section>

      <footer className="party-footer"><p className="party-script">{pageCopy.footerSignoff}</p><p>{pageCopy.footerCrew}</p></footer>

      {showRsvp ? (
        <div className="party-rsvp-dialog" role="dialog" aria-modal="true" aria-labelledby="party-rsvp-title">
          <div className="party-rsvp-panel">
            <button type="button" className="party-dialog-close" onClick={() => setShowRsvp(false)} aria-label="Close RSVP form">Close</button>
            <p className="party-label">{pageCopy.dialogLabel}</p>
            <h2 id="party-rsvp-title">{pageCopy.dialogHeading}</h2>
            <p>{pageCopy.dialogCopy}</p>
            <form onSubmit={handleRsvp} className="party-rsvp-form">
              <label>{pageCopy.firstNameLabel}<input required value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" /></label>
              <label>{pageCopy.lastNameLabel}<input required value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" /></label>
              <button type="submit" disabled={saving}>{saving ? pageCopy.savingLabel : pageCopy.submitLabel}</button>
            </form>
            {rsvpMessage ? <p className="party-rsvp-message" role="status">{rsvpMessage}</p> : null}
          </div>
        </div>
      ) : null}

      {showLoader ? <div className="invite-loader-overlay" aria-live="polite"><WeddingLoader size={210} text={pageCopy.loaderText} /></div> : null}
      <PageContentEditor section={type} content={pageCopy} onContentSaved={setPageCopy} />
    </main>
  );
}
