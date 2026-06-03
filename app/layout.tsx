import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClipAI",
  description: "Generate AI video clips from your ideas",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body style={{ minHeight: "100svh", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 430, position: "relative" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
