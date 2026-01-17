import type { Metadata } from "next";
import "./globals.css";
import { Montserrat, Inter, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

// Optional (accent only)
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata = {
  title: "Yumaniq",
  description: "Motor Intelligence Infrastructure for Physical AI",
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/favicon.ico"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <html lang="en" className={montserrat.className} suppressHydrationWarning>  
      <body>
        <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-sm font-semibold tracking-wide">
              Yumaniq
            </Link>

            <nav className="flex items-center gap-6 text-sm text-white/80">
              <Link href="/rast" className="hover:text-white">
                Product
              </Link>
              <Link href="/#solutions" className="hover:text-white">
                Solutions
              </Link>
              <Link href="/blog" className="hover:text-white">
                Insights
              </Link>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="border-t border-white/10 py-10">
          <div className="mx-auto max-w-6xl px-6 text-sm text-white/60">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <span>© 2026 Yumaniq | Tel Aviv, Israel</span>
              <div className="flex gap-4">
                <Link href="/privacy" className="hover:text-white">
                  Privacy
                </Link>
                <Link href="/licenses" className="hover:text-white">
                  Licenses
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}