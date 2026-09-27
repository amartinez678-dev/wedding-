"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import PageContentEditor from "@/components/PageContentEditor";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content-defaults";

type GuestPhoto = {
  id: string;
  url: string;
  uploadedAt: string;
  filename: string;
};

export default function CameraPage() {
  const [copy, setCopy] = useState(DEFAULT_SITE_CONTENT.camera);
  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/site-content")
      .then((response) => response.ok ? response.json() : null)
      .then((content) => { if (content?.camera) setCopy(content.camera); })
      .catch(() => undefined);

    fetch("/api/guest-photos", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load photos.");
        const result = await response.json();
        setPhotos(result.photos as GuestPhoto[]);
      })
      .catch(() => setMessage(copy.galleryErrorMessage))
      .finally(() => setLoading(false));
  }, [copy.galleryErrorMessage]);

  async function uploadPhoto(file: File) {
    setUploading(true);
    setMessage(copy.uploadingLabel);

    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/guest-photos/upload", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? copy.uploadErrorMessage);

      setPhotos((current) => [result.photo as GuestPhoto, ...current]);
      setMessage(copy.uploadedMessage);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.uploadErrorMessage);
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (file) void uploadPhoto(file);
  }

  return (
    <main className="camera-page">
      <div className="camera-shell">
        <header className="camera-topbar">
          <a href="/" className="camera-wordmark">A + A</a>
          <span>{copy.eyebrow}</span>
        </header>

        <section className="camera-intro" aria-labelledby="camera-heading">
          <div>
            <p className="camera-kicker">GUEST PHOTOGRAPHS</p>
            <h1 id="camera-heading">{copy.title}</h1>
          </div>
          <div className="camera-upload-block">
            <p>{copy.introduction}</p>
            <div className="camera-actions">
              <label className="camera-action camera-action-primary" htmlFor="camera-capture">
                {uploading ? copy.uploadingLabel : copy.takePhotoLabel}
                <input id="camera-capture" className="camera-file-input" type="file" accept="image/*" capture="environment" onChange={handleFileChange} disabled={uploading} />
              </label>
              <label className="camera-action camera-action-secondary" htmlFor="camera-library">
                {copy.choosePhotoLabel}
                <input id="camera-library" className="camera-file-input" type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
              </label>
            </div>
            <p className="camera-status" role="status" aria-live="polite">{message}</p>
          </div>
        </section>

        <section className="camera-gallery" aria-labelledby="camera-gallery-heading">
          <header className="camera-gallery-heading">
            <h2 id="camera-gallery-heading">{copy.galleryHeading}</h2>
            <span>{loading ? "..." : String(photos.length).padStart(2, "0")}</span>
          </header>
          {loading ? (
            <p className="camera-gallery-empty">{copy.uploadingLabel}</p>
          ) : photos.length === 0 ? (
            <p className="camera-gallery-empty">{copy.galleryEmptyMessage}</p>
          ) : (
            <div className="camera-photo-grid">
              {photos.map((photo) => (
                <a className="camera-photo" href={photo.url} key={photo.id} target="_blank" rel="noreferrer" aria-label={`Open ${photo.filename}`}>
                  <img src={photo.url} alt={photo.filename} loading="lazy" />
                  <span>{new Date(photo.uploadedAt).toLocaleDateString()}</span>
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
      <PageContentEditor section="camera" content={copy} onContentSaved={setCopy} />
    </main>
  );
}