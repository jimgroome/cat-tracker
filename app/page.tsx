import Link from "next/link";

import { CatEvent } from "./types";

async function getLatestEvent(): Promise<CatEvent | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/latest`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

function getCatStatus(event?: CatEvent | null) {
  if (!event) {
    return {
      label: "Unknown",
      message: "No cat flap events recorded yet.",
      emoji: "❓",
      bg: "bg-slate-100",
      text: "text-slate-800",
    };
  }

  if (event.event === "out") {
    return {
      label: "Outside",
      message: "Baloo appears to be outside.",
      emoji: "🌳",
      bg: "bg-emerald-100",
      text: "text-emerald-900",
    };
  }

  if (event.event === "in") {
    return {
      label: "Inside",
      message: "Baloo appears to be inside.",
      emoji: "🏠",
      bg: "bg-sky-100",
      text: "text-sky-900",
    };
  }

  return {
    label: "Unknown",
    message: "The latest movement could not be classified.",
    emoji: "🐾",
    bg: "bg-amber-100",
    text: "text-amber-900",
  };
}

export default async function HomePage() {
  const latestEvent = await getLatestEvent();
  const status = getCatStatus(latestEvent);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white flex flex-col">
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-8 flex-1">
        <div className="text-center">
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Where is Baloo?
          </h1>
        </div>

        <section
          className={`w-full rounded-3xl p-8 text-center shadow-2xl ${status.bg} ${status.text}`}
        >
          <div className="text-7xl">{status.emoji}</div>

          <h2 className="mt-6 text-5xl font-black">{status.label}</h2>

          <p className="mt-4 text-lg font-medium">{status.message}</p>

          {latestEvent && (
            <div className="mt-8 rounded-2xl bg-white/60 p-4 text-sm">
              <p className="mt-1 opacity-75">
                {new Date(latestEvent.timestamp).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          )}
        </section>

        <div className="mt-auto flex items-center justify-center gap-4">
          <Link
            href="/recent"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            View recent events
          </Link>

          <Link
            href="/override"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Override location
          </Link>
        </div>
      </div>
    </main>
  );
}
