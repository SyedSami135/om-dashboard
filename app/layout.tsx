import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OM Request Dashboard",
  description: "OM request dashboard — view and update Status, OM Update, Last Follow Up from DB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
