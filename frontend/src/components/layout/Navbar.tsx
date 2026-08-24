// components/layout/Navbar.tsx — full updated version
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Sidebar } from "./Sidebar";

export function Navbar() {
  const { user, isAuthenticated, hasHydrated, logout } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold text-slate-900">
            Tradie<span className="text-amber-500">Hub</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/search"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Find a Tradie
            </Link>

            {!hasHydrated ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-slate-100" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                {user?.role === "TRADIE" && (
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    Dashboard
                  </Link>
                )}
                <Link href="/profile" className="flex items-center gap-2">
                  <Avatar
                    src={user?.profile.avatarUrl}
                    name={`${user?.profile.firstName} ${user?.profile.lastName}`}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {user?.profile.firstName}
                  </span>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="default" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </nav>
      </header>

      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
