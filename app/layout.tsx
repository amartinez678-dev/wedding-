import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amber & Alexander",
  description: "A cinematic luxury wedding invitation experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
