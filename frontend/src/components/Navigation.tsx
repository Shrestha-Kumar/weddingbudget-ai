"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();
  if (pathname === "/") return null; // Hide on landing wizard

  return (
    <nav className="border-b bg-white top-0 sticky z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="font-serif text-xl font-bold text-primary">
                WeddingBudget.ai
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/dashboard" ? "border-primary text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/library"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/library" ? "border-primary text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                Décor Intelligence
              </Link>
              <Link
                href="/sessions"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/sessions" ? "border-primary text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                Scenario Analysis
              </Link>
              <Link
                href="/tracker"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/tracker" ? "border-primary text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                Budget Tracker
              </Link>
              <Link
                href="/tasks"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/tasks" ? "border-primary text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                Master Checklist
              </Link>
              <Link
                href="/vendors"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/vendors" ? "border-primary text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                Vendor CRM
              </Link>
              <Link
                href="/about"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/about" ? "border-primary text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                About Platform
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Restart Wizard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
