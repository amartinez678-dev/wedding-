import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_SITE_CONTENT, type EditableText, type SiteContent } from "./site-content-defaults";

const dataDirectory = path.join(process.cwd(), "data");
const contentPath = path.join(dataDirectory, "site-content.json");

function mergeEditableText(defaults: EditableText, value: unknown): EditableText {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};

  return Object.fromEntries(
    Object.entries(defaults).map(([key, defaultValue]) => [
      key,
      typeof source[key] === "string" ? source[key].slice(0, 4000) : defaultValue,
    ]),
  );
}

function normalizeSiteContent(value: unknown): SiteContent {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};

  return {
    home: mergeEditableText(DEFAULT_SITE_CONTENT.home, source.home),
    invite: mergeEditableText(DEFAULT_SITE_CONTENT.invite, source.invite),
    bachelor: mergeEditableText(DEFAULT_SITE_CONTENT.bachelor, source.bachelor),
    bachelorette: mergeEditableText(DEFAULT_SITE_CONTENT.bachelorette, source.bachelorette),
    camera: mergeEditableText(DEFAULT_SITE_CONTENT.camera, source.camera),
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const saved = await readFile(contentPath, "utf8");
    return normalizeSiteContent(JSON.parse(saved));
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export async function saveSiteContent(value: unknown): Promise<SiteContent> {
  const content = normalizeSiteContent(value);
  await mkdir(dataDirectory, { recursive: true });
  const temporaryPath = `${contentPath}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(content, null, 2), "utf8");
  await rename(temporaryPath, contentPath);
  return content;
}