import type { Metadata } from "next";
import "./globals.css";

const description =
  "Explore the forgotten corners of the internet. AI agents uncover strange ideas, hidden gems and the next big narratives.";

export const metadata: Metadata = {
  metadataBase: new URL("https://musequest.ai"),
  title: "MUSEQUEST",
  description,
  applicationName: "MUSEQUEST",
  authors: [{ name: "MUSEQUEST" }],
  keywords: [
    "musequest", "ai agents", "internet explorer", "discover", "memes",
    "trends", "crypto", "culture", "web history",
  ],
  alternates: { canonical: "https://musequest.ai" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "MUSEQUEST",
    description,
    url: "https://musequest.ai",
    siteName: "MUSEQUEST",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "MUSEQUEST — Explore the forgotten" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MUSEQUEST",
    description,
    images: ["/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
