export const dynamic = "force-dynamic";

export default async function SiteEditorPage() {
  const adminKey = process.env.ADMIN_KEY;

  if (!adminKey) {
    return <main className="site-editor-message"><h1>Site editor is not configured</h1><p>Add an <code>ADMIN_KEY</code> environment variable to your Render service.</p></main>;
  }

  return (
    <main className="site-editor-page">
      <header className="site-editor-header">
        <div>
          <p>AMBER &amp; ALEX · WEBSITE</p>
          <h1>Choose a page to edit</h1>
        </div>
        <a href="/">Open website ↗</a>
      </header>
      <nav className="site-page-picker" aria-label="Pages">
        <a href="/?edit=1"><span>Save the date</span><b>↗</b></a>
        <a href="/invite?edit=1"><span>Wedding invitation</span><b>↗</b></a>
        <a href="/bachelor?edit=1"><span>Bachelor weekend</span><b>↗</b></a>
        <a href="/bachelorette?edit=1"><span>Bachelorette weekend</span><b>↗</b></a>
        <a href="/camera?edit=1"><span>Photo gallery</span><b>↗</b></a>
      </nav>
    </main>
  );
}