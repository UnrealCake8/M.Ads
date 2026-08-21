import type { Metadata } from "next";
import "./globals.css";
import "./mplace-family.css";

export const metadata: Metadata = {
  title: "MPlace Ads (M.Ads)",
  description: "MPlace Ads is MPlace's privacy-first, all-ages advertising network without behavioral tracking.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
