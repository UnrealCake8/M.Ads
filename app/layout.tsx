import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M Ads",
  description: "Privacy-first, all-ages advertising without behavioral tracking.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
