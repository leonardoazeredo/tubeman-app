import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TubeMan App",
  description: "Get notified by what matters to you!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
