import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });
export const metadata: Metadata = {
  title: "VAULT", description: "Account manager pribadi dengan enkripsi lokal",
  manifest: "/manifest.json", icons: { icon: "/icon.svg", apple: "/icon.svg" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "VAULT" },
};
export const viewport: Viewport = { themeColor: "#FFD93D", width: "device-width", initialScale: 1, maximumScale: 1, userScalable: false, viewportFit: "cover" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body className={`${display.variable} ${body.variable}`}>{children}</body></html>;
}
