"use client";

import { useState } from "react";

export default function Page() {
  const [showAddressForm, setShowAddressForm] = useState(false);

  return (
    <main className="save-date-page">
      <section className="save-date-hero" aria-labelledby="save-date-title">
        <span className="poster-line poster-line-left" aria-hidden="true" />
        <span className="poster-line poster-line-right" aria-hidden="true" />

        <div className="save-date-title" id="save-date-title" aria-label="Save the date">
          <div className="save-row">
            <span className="script-letter" aria-hidden="true">S</span>
            <span className="serif-letters">AVE</span>
          </div>
          <div className="date-row">
            <span className="script-letter" aria-hidden="true">T</span>
            <span className="serif-letters">HE DATE</span>
          </div>
        </div>

        <div className="wedding-details">
          <p className="details-lead">TO CELEBRATE THE<br />WEDDING OF</p>
          <p className="couple-names">AMBER &amp;<br />ALEX</p>
          <p className="details-meta">JUNE 26TH, 2027<br />LOS ANGELES, CALIFORNIA<br />FORMAL INVITATION TO FOLLOW</p>
        </div>

        <button type="button" className="address-link" onClick={() => setShowAddressForm(true)}>
          Share mailing address
        </button>
      </section>

      {showAddressForm ? (
        <div className="address-dialog" role="dialog" aria-modal="true" aria-labelledby="address-title">
          <div className="address-dialog-inner">
            <button type="button" className="dialog-close" onClick={() => setShowAddressForm(false)} aria-label="Close address form">Close</button>
            <h2 id="address-title">Share your mailing address</h2>
            <form action="/api/guest-addresses" method="post" className="address-form">
              <input name="name" required placeholder="Full name" />
              <input name="street" required placeholder="Street address" />
              <input name="city" required placeholder="City" />
              <input name="state" required placeholder="State" />
              <input name="zip" required placeholder="ZIP" />
              <button type="submit">Save address</button>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
