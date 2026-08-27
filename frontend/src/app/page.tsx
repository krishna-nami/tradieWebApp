// app/page.tsx
"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archivo_Black } from "next/font/google";
import {
  Search,
  ShieldCheck,
  Star,
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Trees,
  Home as HomeIcon,
  Grid3x3,
  Sparkles,
  ArrowRight,
  FileText,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { FeaturedTradies } from "@/components/home/FeaturedTradies";

import { TRADE_CATEGORIES } from "@/lib/validation/tradieProfile";
import { cn } from "@/lib/utils";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const TRADE_ICONS: Record<string, React.ElementType> = {
  electrical: Zap,
  plumbing: Wrench,
  painting: Paintbrush,
  carpentry: Hammer,
  landscaping: Trees,
  roofing: HomeIcon,
  tiling: Grid3x3,
  general_handyman: Sparkles,
};
const POPULAR_SUBURBS = [
  "Canberra",
  "Sydney",
  "Parramatta",
  "Melbourne",
  "Brisbane",
  "Perth",
];

function formatTradeLabel(trade: string) {
  return trade
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function HazardDivider() {
  return (
    <div
      className="h-2 w-full"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, #0f172a 0, #0f172a 14px, #f59e0b 14px, #f59e0b 28px)",
      }}
    />
  );
}

export default function HomePage() {
  const router = useRouter();
  const [tradeType, setTradeType] = useState("");
  const [suburb, setSuburb] = useState("");
  const [isPending, startTransition] = useTransition();
  const { recent, addSearch } = useRecentSearches();
  const runSearch = (trade: string, sub: string) => {
    addSearch({
      tradeType: trade,
      suburb: sub,
      label:
        [trade && formatTradeLabel(trade), sub].filter(Boolean).join(" in ") ||
        "All tradies",
    });
    const params = new URLSearchParams();
    if (trade) params.set("tradeType", trade);
    if (sub) params.set("suburb", sub);
    startTransition(() => {
      router.push(`/search${params.toString() ? `?${params}` : ""}`);
    });
  };

  const handleSearch = () => {
    runSearch(tradeType, suburb);
  };

  return (
    <div className={cn(archivoBlack.variable)}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        {/* Faint blueprint grid backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:py-28">
          <div className="grid gap-12 sm:grid-cols-5 sm:items-center">
            <div className="sm:col-span-3">
              <p className="font-mono text-xs tracking-[0.2em] text-amber-400">
                AUSTRALIAN TRADES · LICENSED &amp; VERIFIED
              </p>
              <h1
                className="mt-4 text-4xl leading-[1.05] text-white sm:text-6xl"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                GET THE JOB
                <br />
                <span className="text-amber-400">DONE RIGHT.</span>
              </h1>
              <p className="mt-5 max-w-md text-base text-slate-300">
                Find licensed electricians, plumbers, painters and more near
                you. Request a job, get a real quote, pay once it's done.
              </p>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-amber-400" /> Licensed
                  &amp; verified
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard size={16} className="text-amber-400" /> Secure
                  payments
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={16} className="text-amber-400" /> Rated by real
                  customers
                </span>
              </div>
            </div>

            {/* Signature element: job docket card */}
            <div className="sm:col-span-2">
              <div className="relative rounded-md border-2 border-dashed border-amber-400/60 bg-slate-50 p-6 shadow-xl">
                {/* punch holes */}
                <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-slate-900"
                    />
                  ))}
                </div>

                <p className="pl-2 font-mono text-[11px] tracking-widest text-slate-400">
                  JOB REQUEST
                </p>
                <h2 className="mt-1 pl-2 text-lg font-bold text-slate-900">
                  Find your tradie
                </h2>

                <div className="mt-4 flex flex-col gap-2 pl-2">
                  <Select
                    value={tradeType}
                    onValueChange={(v) => setTradeType(v ?? "")}
                  >
                    <SelectTrigger aria-label="Tradie type">
                      <SelectValue placeholder="Any trade" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRADE_CATEGORIES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {formatTradeLabel(t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    placeholder="Suburb, e.g. Canberra"
                    aria-label="Suburb"
                  />
                  <Button
                    onClick={handleSearch}
                    isLoading={isPending}
                    className="mt-1"
                  >
                    {!isPending && <Search size={16} className="mr-1.5" />}
                    Search tradies
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(recent.length > 0
                  ? recent.map((r) => ({
                      label: r.label,
                      onClick: () => runSearch(r.tradeType, r.suburb),
                    }))
                  : POPULAR_SUBURBS.map((s) => ({
                      label: s,
                      onClick: () => runSearch("", s),
                    }))
                ).map((chip, i) => (
                  <button
                    key={i}
                    onClick={chip.onClick}
                    className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 transition-colors hover:border-amber-400 hover:text-amber-400"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 pl-1 text-[11px] text-slate-500">
                {recent.length > 0 ? "Your recent searches" : "Popular suburbs"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <HazardDivider />

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-center font-mono text-xs tracking-[0.2em] text-slate-400">
          THE PROCESS
        </p>
        <h2
          className="mt-2 text-center text-2xl text-slate-900 sm:text-3xl"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          THREE STEPS TO DONE
        </h2>

        <div className="relative mt-10 grid gap-8 sm:grid-cols-3">
          <div
            className="absolute left-0 right-0 top-6 hidden border-t-2 border-dashed border-slate-200 sm:block"
            aria-hidden="true"
          />
          {[
            {
              icon: Search,
              num: "01",
              title: "Find a tradie",
              desc: "Search by trade and suburb, browse verified profiles.",
            },
            {
              icon: FileText,
              num: "02",
              title: "Get a quote",
              desc: "Request a job — your tradie sends an itemised quote.",
            },
            {
              icon: CheckCircle2,
              num: "03",
              title: "Book & pay",
              desc: "Accept the quote, confirm the booking, pay when it's done.",
            },
          ].map(({ icon: Icon, num, title, desc }) => (
            <div key={num} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-slate-900">
                <Icon size={20} />
              </div>
              <p className="mt-4 font-mono text-xs text-amber-500">{num}</p>
              <h3 className="mt-1 font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by trade */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-center font-mono text-xs tracking-[0.2em] text-slate-400">
            TRADES ON TRADIEHUB
          </p>
          <h2
            className="mt-2 text-center text-2xl text-slate-900 sm:text-3xl"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            BROWSE BY TRADE
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TRADE_CATEGORIES.map((trade) => {
              const Icon = TRADE_ICONS[trade] ?? Wrench;
              return (
                <Link key={trade} href={`/search?tradeType=${trade}`}>
                  <Card className="border-slate-200 transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md">
                    <CardContent className="flex flex-col items-center gap-2 p-5 text-center">
                      <Icon size={22} className="text-amber-500" />
                      <span className="text-sm font-medium text-slate-900">
                        {formatTradeLabel(trade)}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* For tradies */}
      <section className="relative overflow-hidden bg-slate-900 py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
          <div className="flex h-14 w-14 -rotate-6 items-center justify-center rounded-full border-2 border-amber-400 text-amber-400">
            <ShieldCheck size={26} />
          </div>
          <p className="font-mono text-xs tracking-[0.2em] text-amber-400">
            FOR TRADIES
          </p>
          <h2
            className="text-2xl text-white sm:text-3xl"
            style={{ fontFamily: "var(--font-display), sans-serif" }}
          >
            YOUR NEXT JOB IS HERE
          </h2>
          <p className="max-w-md text-sm text-slate-300">
            Join TradieHub to find new work, manage bookings, and get paid
            securely — no more chasing invoices or missed calls.
          </p>
          <Link href="/register?role=tradie">
            <Button variant="accent" className="mt-2">
              Join as a tradie <ArrowRight size={16} className="ml-1.5" />
            </Button>
          </Link>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-center font-mono text-xs tracking-[0.2em] text-slate-400">
          ON TRADIEHUB NOW
        </p>
        <h2
          className="mt-2 text-center text-2xl text-slate-900 sm:text-3xl"
          style={{ fontFamily: "var(--font-display), sans-serif" }}
        >
          MEET SOME OF OUR TRADIES
        </h2>
        <div className="mt-8">
          <FeaturedTradies />
        </div>
      </section>
    </div>
  );
}
