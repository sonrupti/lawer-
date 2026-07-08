import Link from "next/link";
import { Scale } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface/30 backdrop-blur-md transition-colors duration-300 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NyayaIntel
              </span>
            </div>
            <p className="text-sm text-text-muted max-w-xs">
              Next-generation legal intelligence and lawyer discovery platform. Access verified activity metrics for Indian High Courts.
            </p>
          </div>

          {/* Scope and Coverage Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider">Coverage</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>Odisha High Court (MVP)</li>
              <li className="text-xs italic text-text-muted/65">(District & tribunals coming in Phase 2)</li>
            </ul>
          </div>

          {/* Legal Disclaimer Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider">Legal Disclaimer</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Court outcomes are highly nuanced and depend on procedural postures, client goals, and judge discretion. Statistics displayed represent public records and should not be used as absolute ranking or guarantee of success.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-border/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {currentYear} NyayaIntel. All rights reserved. Made for Odisha Judiciary.
          </p>
          <div className="flex gap-6 text-xs text-text-muted">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/lawyers" className="hover:text-primary transition-colors">Directory</Link>
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
