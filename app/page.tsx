"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content-defaults";
import PageContentEditor from "@/components/PageContentEditor";

export default function Page() {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [copy, setCopy] = useState(DEFAULT_SITE_CONTENT.home);

  useEffect(() => {
    fetch("/api/site-content")
      .then((response) => response.ok ? response.json() : null)
      .then((content) => { if (content?.home) setCopy(content.home); })
      .catch(() => undefined);
  }, []);

  return (
    <main className="save-date-page">
      <section className="save-date-hero" aria-labelledby="save-date-title">
        <span className="poster-line poster-line-left" aria-hidden="true" />
        <span className="poster-line poster-line-right" aria-hidden="true" />

        <div className="save-date-title" id="save-date-title" aria-label={`${copy.saveTheDate} ${copy.theDate}`}>
          <div className="save-row">
            <span className="script-letter" aria-hidden="true">{copy.saveTheDate.slice(0, 1)}</span>
            <span className="serif-letters">{copy.saveTheDate.slice(1)}</span>
          </div>
          <div className="date-row">
            <span className="script-letter" aria-hidden="true">{copy.theDate.slice(0, 1)}</span>
            <span className="serif-letters">{copy.theDate.slice(1)}</span>
          </div>
        </div>

        <div className="wedding-details">
          <p className="details-lead" style={{ whiteSpace: "pre-line" }}>{copy.detailsLead}</p>
          <p className="couple-names" style={{ whiteSpace: "pre-line" }}>{copy.coupleNames}</p>
          <p className="details-meta" style={{ whiteSpace: "pre-line" }}>{copy.detailsMeta}</p>
        </div>

        <button type="button" className="address-link" onClick={() => setShowAddressForm(true)}>
          {copy.shareAddressLabel}
        </button>
      </section>

      {showAddressForm ? (
        <div className="address-dialog" role="dialog" aria-modal="true" aria-labelledby="address-title">
          <div className="address-dialog-inner">
            <button type="button" className="dialog-close" onClick={() => setShowAddressForm(false)} aria-label={copy.closeLabel}>{copy.closeLabel}</button>
            <h2 id="address-title">{copy.addressDialogTitle}</h2>
            <form action="/api/guest-addresses" method="post" className="address-form">
              <input name="name" required placeholder={copy.fullNamePlaceholder} />
              <input name="street" required placeholder={copy.streetPlaceholder} />
              <input name="city" required placeholder={copy.cityPlaceholder} />
              <input name="state" required placeholder={copy.statePlaceholder} />
              <input name="zip" required placeholder={copy.zipPlaceholder} />
              <button type="submit">{copy.saveAddressLabel}</button>
            </form>
          </div>
        </div>
      ) : null}
      <PageContentEditor section="home" content={copy} onContentSaved={setCopy} />
    </main>
  );
}
