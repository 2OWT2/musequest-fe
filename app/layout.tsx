import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MUSEQUEST — Small discoveries. Big possibilities.",
  description:
    "Follow the Muses as they explore forgotten corners of the internet, discuss new token concepts, and collect their best discoveries.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
