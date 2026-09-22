import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { put, list } from "@vercel/blob";

export type GuestPhotoRecord = {
  id: string;
  url: string;
  uploadedAt: string;
  filename: string;
  contentType: string;
  source: "local" | "blob";
};

const LOCAL_DATA_DIR = path.join(process.cwd(), "data", "guest-photos");
const LOCAL_INDEX_PATH = path.join(LOCAL_DATA_DIR, "index.json");
const LOCAL_FILE_ROUTE_PREFIX = "/api/guest-photos/file/";

function usesBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function ensureLocalStorage() {
  await mkdir(LOCAL_DATA_DIR, { recursive: true });
}

async function readLocalIndex() {
  await ensureLocalStorage();

  try {
    const raw = await readFile(LOCAL_INDEX_PATH, "utf8");
    return JSON.parse(raw) as GuestPhotoRecord[];
  } catch {
    return [];
  }
}

async function writeLocalIndex(records: GuestPhotoRecord[]) {
  await ensureLocalStorage();
  await writeFile(LOCAL_INDEX_PATH, JSON.stringify(records, null, 2), "utf8");
}

export async function listGuestPhotos(): Promise<GuestPhotoRecord[]> {
  if (usesBlobStorage()) {
    const { blobs } = await list({ prefix: "guest-photos/" });

    return blobs
      .map((blob) => ({
        id: blob.pathname,
        url: blob.url,
        uploadedAt: blob.uploadedAt.toISOString(),
        filename: blob.pathname.split("/").pop() ?? "guest-photo",
        contentType: "image/jpeg",
        source: "blob" as const,
      }))
      .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
  }

  const records = await readLocalIndex();
  return records.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
}

export async function saveGuestPhoto(file: File): Promise<GuestPhotoRecord> {
  if (usesBlobStorage()) {
    const blob = await put(`guest-photos/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return {
      id: blob.pathname,
      url: blob.url,
      uploadedAt: new Date().toISOString(),
      filename: file.name,
      contentType: file.type || "image/jpeg",
      source: "blob",
    };
  }

  const extension = path.extname(file.name) || ".jpg";
  const id = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const filepath = path.join(LOCAL_DATA_DIR, id);
  const bytes = Buffer.from(await file.arrayBuffer());

  await ensureLocalStorage();
  await writeFile(filepath, bytes);

  const record: GuestPhotoRecord = {
    id,
    url: `${LOCAL_FILE_ROUTE_PREFIX}${id}`,
    uploadedAt: new Date().toISOString(),
    filename: file.name,
    contentType: file.type || "image/jpeg",
    source: "local",
  };

  const existing = await readLocalIndex();
  existing.unshift(record);
  await writeLocalIndex(existing);

  return record;
}

export async function readLocalGuestPhoto(id: string) {
  const filepath = path.join(LOCAL_DATA_DIR, id);
  const bytes = await readFile(filepath);
  const records = await readLocalIndex();
  const metadata = records.find((record) => record.id === id);

  return {
    bytes,
    contentType: metadata?.contentType || "image/jpeg",
  };
}
