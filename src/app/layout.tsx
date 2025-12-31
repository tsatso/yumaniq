import "./globals.css";
import { Montserrat } from "next/font/google";
import Link from "next/link";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Yumaniq",
  description: "Motor Intelligence Infrastructure for Physical AI"
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
              <Link href="/rast" className="hover:text-white">RAST</Link>
              <Link href="/about" className="hover:text-white">About</Link>
              <Link href="/blog" className="hover:text-white">Insights</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-white/10 py-10">
          <div className="mx-auto max-w-6xl px-6 text-sm text-white/60">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <span>© {new Date().getFullYear()} Yumaniq | Tel Aviv, Israel</span>
              <div className="flex gap-4">
                <Link href="/privacy" className="hover:text-white">Privacy</Link>
                <Link href="/licenses" className="hover:text-white">Licenses</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
