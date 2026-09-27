"use client";

import { useEffect, useState } from "react";
import type { EditableText, SiteContent } from "@/lib/site-content-defaults";

const sectionLabels: Record<keyof SiteContent, string> = {
  home: "Save the date",
  invite: "Wedding invitation",
  bachelor: "Bachelor weekend",
  bachelorette: "Bachelorette weekend",
  camera: "Photo gallery",
};

function formatLabel(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/Url$/, "link address")
    .replace(/^./, (character) => character.toUpperCase());
}

type PageContentEditorProps = {
  section: keyof SiteContent;
  content: EditableText;
  onContentSaved: (content: EditableText) => void;
};

export default function PageContentEditor({ section, content, onContentSaved }: PageContentEditorProps) {
  const [enabled, setEnabled] = useState(false);
  const [draft, setDraft] = useState(content);
  const [adminKey, setAdminKey] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    setEnabled(url.searchParams.get("edit") === "1");
  }, []);

  useEffect(() => setDraft(content), [content]);

  if (!enabled) return null;

  function closeEditor() {
    const url = new URL(window.location.href);
    url.searchParams.delete("edit");
    window.history.replaceState({}, "", url);
    setEnabled(false);
  }

  function updateField(field: string, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setMessage("");
  }

  async function savePage() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/site-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ section, content: draft }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to save page.");

      onContentSaved(result.content[section] as EditableText);
      setMessage("Page saved and updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save page.");
    } finally {
      setSaving(false);
    }
  }

  return (
      <aside className="page-editor-panel" aria-label={`${sectionLabels[section]} editor`}>
        <header className="page-editor-heading">
          <div><p>PAGE EDITOR</p><h2>{sectionLabels[section]}</h2></div>
          <button type="button" onClick={closeEditor} aria-label="Close page editor">Close</button>
        </header>
        <div className="page-editor-fields">
          {Object.entries(draft).map(([field, value]) => (
            <label className="site-editor-field" key={field}>
              <span>{formatLabel(field)}{field.endsWith("Url") ? " (URL)" : ""}</span>
              {field.endsWith("Url") ? (
                <input type="text" inputMode="url" value={value} onChange={(event) => updateField(field, event.target.value)} />
              ) : (
                <textarea rows={value.length > 90 ? 3 : 2} value={value} onChange={(event) => updateField(field, event.target.value)} />
              )}
            </label>
          ))}
        </div>
        <footer className="page-editor-footer">
          <label className="site-editor-key">Admin key
            <input type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} autoComplete="current-password" />
          </label>
          <p role="status">{message}</p>
          <button type="button" onClick={savePage} disabled={saving || !adminKey}>{saving ? "Saving..." : "Save page"}</button>
        </footer>
      </aside>
  );
}