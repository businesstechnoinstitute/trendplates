import "./globals.css";
import { fontVariables } from "@/lib/fonts";

export const metadata = {
  title: "Trendplates | Organic Growth Systems for Electronic Dance Music",
  description:
    "Trendplates is an organic growth agency for electronic and dance music. Fan-page networks, creative formats and culture-first campaigns for labels, artists, management, festivals and catalogue owners. No paid ads.",
  openGraph: {
    title: "Trendplates | Organic Growth Systems for Electronic Dance Music",
    description:
      "Organic growth for electronic and dance music. Culture-first campaigns, fan-page networks and creative formats that turn records into movements.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="bg-ink text-paper antialiased">{children}</body>
    </html>
  );
}
