"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import WeddingLoader from "../../components/WeddingLoader";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content-defaults";
import PageContentEditor from "@/components/PageContentEditor";

function getCountdown(targetDate: string) {
  const difference = Math.max(0, new Date(targetDate).getTime() - Date.now());
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function Countdown({ targetDate, labels }: { targetDate: string; labels: string[] }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setCountdown(getCountdown(targetDate));
    const interval = window.setInterval(() => setCountdown(getCountdown(targetDate)), 1000);
    return () => window.clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="invite-countdown" aria-label="Countdown to the wedding">
      {Object.entries(countdown).map(([, value], index) => (
        <div className="countdown-unit" key={labels[index]}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <span>{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}

export default function InvitePage() {
  const [copy, setCopy] = useState(DEFAULT_SITE_CONTENT.invite);
  const [showLoader, setShowLoader] = useState(false);
  const [showRsvp, setShowRsvp] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpCount, setRsvpCount] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/site-content")
      .then((response) => response.ok ? response.json() : null)
      .then((content) => { if (content?.invite) setCopy(content.invite); })
      .catch(() => undefined);
  }, []);

  const schedule = [1, 2, 3, 4].map((number) => ({
    time: copy[`schedule${number}Time`],
    title: copy[`schedule${number}Title`],
    detail: copy[`schedule${number}Detail`],
  }));

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
      setRsvpMessage(copy.rsvpSuccessMessage);
      setFirstName("");
      setLastName("");
    } catch {
      setRsvpMessage(copy.rsvpErrorMessage);
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
          <span>{copy.heroTopLeft}</span>
          <span>{copy.heroTopRight}</span>
        </div>
        <div className="invite-hero-content">
          <p className="invite-kicker">{copy.heroKicker}</p>
          <h1>{copy.heroNames.split("&")[0]} <i>&amp;</i> {copy.heroNames.split("&").slice(1).join("&")}</h1>
          <p className="invite-date">{copy.heroDate}</p>
          <span className="invite-hero-stamp" style={{ whiteSpace: "pre-line" }}>{copy.heroStamp}</span>
        </div>
        <div className="invite-hero-bottom">
          <span>{copy.heroFormalLabel}</span>
          <span className="hero-scroll">{copy.heroScrollLabel}</span>
        </div>
      </header>

      <section className="invite-countdown-section">
        <div>
          <p className="invite-section-label">{copy.countdownLabel}</p>
          <h2>{copy.countdownHeading}</h2>
        </div>
        <Countdown targetDate={copy.countdownTarget} labels={[copy.countdownDaysLabel, copy.countdownHoursLabel, copy.countdownMinutesLabel, copy.countdownSecondsLabel]} />
      </section>

      <section className="invite-intro" aria-labelledby="invite-heading">
        <div>
          <p className="invite-section-label">{copy.invitationLabel}</p>
          <h2 id="invite-heading">{copy.invitationHeading}</h2>
        </div>
        <div className="invite-intro-copy">
          <p>{copy.invitationCopy}</p>
          <p className="invite-signoff">{copy.invitationSignoff}</p>
        </div>
      </section>

      <section className="invite-feature-grid" aria-label="Wedding details">
        <div className="invite-feature-image invite-feature-image-one">
          <img src={copy.ceremonyImageUrl} alt={copy.ceremonyImageAlt} />
          <span>{copy.ceremonyImageLabel}</span>
        </div>
        <div className="invite-detail-block">
          <p className="invite-section-label">{copy.ceremonyLabel}</p>
          <h2>{copy.ceremonyVenue}</h2>
          <p>{copy.ceremonyTime}</p>
          <p>{copy.ceremonyStreet}</p>
          <p>{copy.ceremonyCity}</p>
          <p><a className="venue-map-link" href={copy.ceremonyMapUrl} target="_blank" rel="noreferrer">{copy.ceremonyMapLabel}</a></p>
          <p>{copy.ceremonyDate}</p>
          <p className="invite-muted">{copy.ceremonyNote}</p>
        </div>
        <div className="invite-detail-block invite-detail-accent">
          <p className="invite-section-label">{copy.receptionLabel}</p>
          <h2>{copy.receptionVenue}</h2>
          <p>{copy.receptionStreet}</p>
          <p>{copy.receptionCity}</p>
          <p>{copy.receptionTime}</p>
          <p>{copy.cocktailHour}</p>
          <p><a className="venue-map-link" href={copy.receptionMapUrl} target="_blank" rel="noreferrer">{copy.receptionMapLabel}</a></p>
          <span className="feature-mark">A + A</span>
        </div>
        <div className="invite-feature-image invite-feature-image-two">
          <img src={copy.receptionImageUrl} alt={copy.receptionImageAlt} />
          <span>{copy.receptionImageLabel}</span>
        </div>
      </section>

      <section className="invite-schedule" aria-labelledby="schedule-heading">
        <div className="invite-section-heading">
          <p className="invite-section-label">{copy.scheduleLabel}</p>
          <h2 id="schedule-heading">{copy.scheduleHeading}</h2>
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
          <p className="invite-section-label">{copy.planningLabel}</p>
          <h2>{copy.planningHeading}</h2>
          <p>{copy.planningCopy}</p>
        </div>
        <div className="planning-links">
          <a href={copy.questionLinkUrl}>{copy.questionLinkLabel} <span>↗</span></a>
          <a href={copy.losAngelesLinkUrl} target="_blank" rel="noreferrer">{copy.losAngelesLinkLabel} <span>↗</span></a>
          <a href={copy.zelleLinkUrl}>{copy.zelleLinkLabel} <span>↗</span></a>
          <a href={copy.venmoLinkUrl} target="_blank" rel="noreferrer">{copy.venmoLinkLabel} <span>↗</span></a>
        </div>
      </section>

      <section className="invite-rsvp" aria-labelledby="rsvp-heading">
        <div>
          <p className="invite-section-label">{copy.rsvpLabel}</p>
          <h2 id="rsvp-heading">{copy.rsvpHeading}</h2>
          <p>{copy.rsvpCopy}</p>
        </div>
        <button type="button" onClick={openRsvp}>{copy.rsvpButtonLabel} <span>↗</span></button>
      </section>

      <footer className="invite-footer">
        <p className="script-font">{copy.footerSignoff}</p>
        <p>{copy.footerLocation}</p>
      </footer>

      {showLoader ? <div className="invite-loader-overlay" aria-live="polite"><WeddingLoader size={210} text={copy.loaderText} /></div> : null}

      {showRsvp ? (
        <div className="wedding-rsvp-dialog" role="dialog" aria-modal="true" aria-labelledby="wedding-rsvp-title">
          <div className="wedding-rsvp-panel">
            <button type="button" className="wedding-dialog-close" onClick={() => setShowRsvp(false)} aria-label={copy.dialogCloseLabel}>{copy.dialogCloseLabel}</button>
            <p className="invite-section-label">{copy.rsvpLabel}</p>
            <h2 id="wedding-rsvp-title">{copy.rsvpDialogHeading}</h2>
            <p className="wedding-rsvp-copy">{copy.rsvpDialogCopy}</p>
            <form onSubmit={saveRsvp} className="wedding-rsvp-form">
              <label>{copy.rsvpFirstNameLabel}<input required value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" /></label>
              <label>{copy.rsvpLastNameLabel}<input required value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" /></label>
              <button type="submit" disabled={saving}>{saving ? copy.rsvpSavingLabel : copy.rsvpSubmitLabel}</button>
            </form>
            {rsvpMessage ? <p className="wedding-rsvp-message" role="status">{rsvpMessage}</p> : null}
            {rsvpCount !== null ? <p className="wedding-rsvp-count">{rsvpCount} guest{rsvpCount === 1 ? "" : "s"} on the list</p> : null}
          </div>
        </div>
      ) : null}
      <PageContentEditor section="invite" content={copy} onContentSaved={setCopy} />
    </main>
  );
}
