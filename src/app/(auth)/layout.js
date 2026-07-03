import { Geist } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Link from "next/link";
import { Scale } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "NyayaIntel | Account",
  description: "Sign in or create your NyayaIntel account.",
};

/**
 * Auth Layout — minimal layout for authentication pages.
 * No Navbar or Footer — just a centered, branded card container.
 * Reuses the existing design system tokens from globals.css.
 */
export default function AuthLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg text-text transition-colors duration-300">
        <ThemeProvider>
          {/* Minimal auth header with just the logo */}
          <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-14 items-center">
                <Link href="/" className="flex items-center gap-2 group">
                  <Scale className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
                  <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    NyayaIntel
                  </span>
                </Link>
              </div>
            </div>
          </header>

          {/* Centered page content */}
          <main className="flex-1 flex items-center justify-center px-4 py-12">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
