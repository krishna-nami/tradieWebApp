// components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShieldCheck, CreditCard, ArrowUp } from "lucide-react";

const FacebookIcon = ({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const TwitterIcon = ({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({
  size = 18,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const socialLinks = [
  {
    icon: FacebookIcon,
    label: "Facebook",
    href: "/",
    hoverColor: "hover:bg-[#1877F2] hover:border-[#1877F2]",
  },
  {
    icon: InstagramIcon,
    label: "Instagram",
    href: "/",
    hoverColor: "hover:bg-[#E4405F] hover:border-[#E4405F]",
  },
  {
    icon: TwitterIcon,
    label: "X (Twitter)",
    href: "/",
    hoverColor: "hover:bg-black hover:border-black",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    href: "/",
    hoverColor: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
  },
];

// Only routes that actually exist in the app
const columns = [
  {
    heading: "For customers",
    links: [
      { label: "Find a tradie", href: "/search" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    heading: "For tradies",
    links: [
      { label: "Join as a tradie", href: "/register?role=tradie" },
      { label: "Tradie dashboard", href: "/dashboard" },
    ],
  },
];

const trustBadges = [
  {
    icon: ShieldCheck,
    label: "Licensed & Verified",
    color: "text-emerald-400",
  },
  { icon: CreditCard, label: "Secure Payments", color: "text-blue-400" },
];

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className=" relative border-t-2 border-slate-400/20 bg-slate-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 rounded-full bg-amber-500 p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="col-span-1 space-y-4 sm:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-white transition-colors hover:text-amber-400">
                Tradie<span className="text-amber-400">Hub</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-400">
              Connecting Australians with trusted local tradies. Licensed,
              verified, and secure from booking to payment.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              {trustBadges.map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon size={16} className={color} />
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              {socialLinks.map(({ icon: Icon, label, href, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 text-slate-400 transition-all hover:scale-110 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${hoverColor}`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading} className="col-span-1">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 transition-all hover:text-white hover:translate-x-0.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} TradieHub. All rights reserved.
          </span>
          <span className="font-mono text-[10px] tracking-wider">
            Built in Canberra, Australia
          </span>
        </div>
      </div>
    </footer>
  );
}
