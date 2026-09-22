import { listWeddingRsvps } from "../../../lib/party-rsvps";

type AdminPageProps = {
  searchParams: Promise<{ key?: string }>;
};

export default async function WeddingRsvpsAdminPage({ searchParams }: AdminPageProps) {
  const { key } = await searchParams;
  const adminKey = process.env.ADMIN_KEY;
  const authorized = Boolean(adminKey && key === adminKey);

  if (!adminKey) {
    return <main className="admin-rsvps-page"><h1>RSVP admin is not configured</h1><p>Add an <code>ADMIN_KEY</code> environment variable before using this page.</p></main>;
  }

  if (!authorized) {
    return <main className="admin-rsvps-page"><h1>Wedding RSVPs</h1><p>Use the private admin URL with the configured key.</p></main>;
  }

  const rsvps = listWeddingRsvps();

  return (
    <main className="admin-rsvps-page">
      <header className="admin-rsvps-header">
        <p>Amber &amp; Alex · Wedding RSVP</p>
        <h1>Guest list</h1>
        <strong>{rsvps.length} guest{rsvps.length === 1 ? "" : "s"} confirmed</strong>
      </header>
      <section className="admin-rsvps-list" aria-label="Wedding RSVP guest list">
        {rsvps.length === 0 ? <p>No wedding RSVPs yet.</p> : rsvps.map((rsvp) => <div className="admin-rsvp-row" key={rsvp.id}><span>{rsvp.firstName} {rsvp.lastName}</span><time>{rsvp.createdAt}</time></div>)}
      </section>
    </main>
  );
}
