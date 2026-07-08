import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NyayaIntel | Legal Intelligence & Lawyer Discovery",
  description: "Gaming-level analytics, case histories, and AI-generated intelligence for High Court advocates.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg text-text transition-colors duration-300">
        <ThemeProvider>
          {/* Global Header Navigation */}
          <Navbar />
          
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          
          {/* Global Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}