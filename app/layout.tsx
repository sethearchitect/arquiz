import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arquiz — Which speaks to you?",
  description:
    "An art discovery game powered by the Art Institute of Chicago's public collection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
