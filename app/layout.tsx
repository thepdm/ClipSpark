import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClipSpark",
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
        <div style={{ width: "100%", maxWidth: 430, position: "relative", borderLeft: "1px solid rgba(255,255,255,0.06)", borderRight: "1px solid rgba(255,255,255,0.06)", minHeight: "100svh" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
