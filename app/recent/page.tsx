import Link from "next/link";

import { CatEvent } from "../types";

async function getRecentEvents(): Promise<CatEvent[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/recent`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

function formatEvent(event: CatEvent["event"]) {
  if (event === "out") return "Went out";
  if (event === "in") return "Came in";
  return "Unknown movement";
}

function getEventEmoji(event: CatEvent["event"]) {
  if (event === "out") return "🌳";
  if (event === "in") return "🏠";
  return "🐾";
}

export default async function EventsPage() {
  const events = await getRecentEvents();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Recent events</h1>
          </div>

          <Link
            href="/"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Home
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="rounded-3xl bg-slate-900 p-8 text-center">
            <p className="text-lg font-semibold">No events yet</p>
            <p className="mt-2 text-slate-400">
              Once the cat flap reports movement, it will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
            <ul className="divide-y divide-slate-800">
              {events.map((event, index) => (
                <li
                  key={`${event.timestamp}-${event.event}-${index}`}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-2xl">
                    {getEventEmoji(event.event)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{formatEvent(event.event)}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {new Date(event.timestamp).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
