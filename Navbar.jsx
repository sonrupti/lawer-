"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sun, Moon, Scale, Menu, X,
  User, LogOut, LogIn, UserPlus, ChevronDown, Globe
} from "lucide-react";

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null); // null = not fetched, false = not authed
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userMenuRef = useRef(null);

  // Hydration guard for theme icon
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Fetch current user profile from API
  useEffect(() => {
    fetch("/api/auth/profile")
      .then((r) => r.json())
      .then((data) => {
        setAuthUser(data.user || false);
      })
      .catch(() => setAuthUser(false));
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setAuthUser(false);
      setUserMenuOpen(false);
      router.push("/login");
      router.refresh();
    } catch {
      // ignore
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Scale className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NyayaIntel
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center gap-6">
              <Link
                href="/ask-ai"
                className="text-sm font-medium text-text/80 hover:text-primary transition-colors duration-200"
              >
                Ask AI
              </Link>
              <Link
                href="/lawyers"
                className="text-sm font-medium text-text/80 hover:text-primary transition-colors duration-200"
              >
                Lawyers Directory
              </Link>
              <Link
                href="/admin"
                className="text-sm font-medium text-text/80 hover:text-primary transition-colors duration-200"
              >
                Admin Panel
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="relative rounded-lg p-2 hover:bg-surface-2 text-text/80 hover:text-text border border-border/50 hover:border-border transition-all duration-200 cursor-pointer w-9 h-9 flex items-center justify-center"
                aria-label="Toggle Theme"
              >
                {mounted ? (
                  resolvedTheme === "dark" ? (
                    <Sun className="h-4 w-4 text-accent transition-transform duration-300 rotate-0 hover:scale-110" />
                  ) : (
                    <Moon className="h-4 w-4 text-primary transition-transform duration-300 rotate-0 hover:scale-110" />
                  )
                ) : (
                  <div className="h-4 w-4 rounded-full bg-border animate-pulse" />
                )}
              </button>

              {/* Auth Section */}
              {authUser === null ? (
                // Loading skeleton
                <div className="h-8 w-24 rounded-lg bg-border/40 animate-pulse" />
              ) : authUser ? (
                // User dropdown
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface/40 hover:bg-surface-2 px-3 py-1.5 text-sm font-medium text-text transition-all duration-200 cursor-pointer"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="max-w-[100px] truncate">{authUser.username || authUser.email?.split("@")[0]}</span>
                    <ChevronDown className={`h-3.5 w-3.5 text-text-muted transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 glass-card border border-border shadow-2xl py-1 z-50">
                      <div className="px-4 py-2 border-b border-border/50">
                        <p className="text-xs font-semibold text-text truncate">{authUser.username}</p>
                        <p className="text-xs text-text-muted truncate">{authUser.email}</p>
                        {authUser.preferredLanguage && (
                          <p className="text-xs text-accent mt-0.5 flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {authUser.preferredLanguage}
                          </p>
                        )}
                      </div>
                      <Link
                        href="/select-language"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text/80 hover:bg-surface-2 hover:text-primary transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        Change Language
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger/80 hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? "Signing out..." : "Sign out"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Not logged in
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 text-sm font-medium text-text/80 hover:text-primary transition-colors duration-200"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg transition-all duration-200"
                  >
                    <UserPlus className="h-4 w-4" />
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 text-text/80 hover:text-text border border-border/50 hover:bg-surface-2 transition-all duration-200 cursor-pointer w-9 h-9 flex items-center justify-center"
              aria-label="Toggle Theme"
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <Sun className="h-4 w-4 text-accent" />
                ) : (
                  <Moon className="h-4 w-4 text-primary" />
                )
              ) : (
                <div className="h-4 w-4 rounded-full bg-border animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-text/80 hover:text-text hover:bg-surface-2 border border-border/50 transition-all duration-200 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-3 space-y-2 transition-all duration-200">
          <Link
            href="/ask-ai"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-text/80 hover:bg-surface-2 hover:text-primary transition-colors"
          >
            Ask AI
          </Link>
          <Link
            href="/lawyers"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-text/80 hover:bg-surface-2 hover:text-primary transition-colors"
          >
            Lawyers Directory
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-text/80 hover:bg-surface-2 hover:text-primary transition-colors"
          >
            Admin Panel
          </Link>

          {/* Mobile Auth Links */}
          {authUser ? (
            <>
              <div className="px-3 py-2 border-t border-border/50">
                <p className="text-xs text-text-muted">Signed in as</p>
                <p className="text-sm font-semibold text-text">{authUser.username || authUser.email}</p>
              </div>
              <Link
                href="/select-language"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-text/80 hover:bg-surface-2 hover:text-primary transition-colors"
              >
                <Globe className="h-4 w-4" />
                Change Language
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full text-left flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-text/80 hover:bg-surface-2 hover:text-primary transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}