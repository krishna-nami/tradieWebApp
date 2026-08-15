"use client";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { X } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import Link from "next/link";
import { Button } from "../ui/Button";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const publicLinks = [
  { href: "/search", label: "Find a Tradie" },
  { href: "/how-it-works", label: "How it works" },
];
const authedLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/bookings", label: "My Bookings" },
  { href: "/profile", label: "Profile" },
];
export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, isAuthenticated, logout, hasHydrated } = useAuthStore();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer*/}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-white shadow-lg transition-transform duration-200 md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <span className="text-lg font-bold text-slate-900">
            Tradie<span className="text-amber-500">Hub</span>
          </span>
          <button onClick={onClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        {hasHydrated && isAuthenticated && (
          <div className="flex items-center gap-3 border-b border-slate-100 p-4">
            <Avatar
              src={user?.profile.avatarUrl}
              name={`${user?.profile.firstName} ${user?.profile.lastName}`}
              size="sm"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">
                {user?.profile.firstName} {user?.profile.lastName}
              </p>
              <p className="text-xs text-slate-500">
                {user?.role === "TRADIE" ? "Tradie" : "Customer"}
              </p>
            </div>
          </div>
        )}
        <nav className="flex flex-col p-2">
          {publicLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {l.label}
            </Link>
          ))}
          {hasHydrated && isAuthenticated && (
            <>
              <div className="my-2 border-t border-slate-100" />
              {authedLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={onClose}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {l.label}
                </Link>
              ))}
            </>
          )}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-slate-100 p-4">
          {hasHydrated && isAuthenticated ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                logout();
                onClose();
              }}
            >
              Log out
            </Button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" onClick={onClose}>
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/register" onClick={onClose}>
                <Button variant="default" className="w-full">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
