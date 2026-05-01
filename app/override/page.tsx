import Link from "next/link";
import { redirect } from "next/navigation";

import { appendCatEvent } from "@/app/lib/cat-events";

async function setCatLocation(formData: FormData) {
  "use server";

  const event = formData.get("event");

  if (event !== "in" && event !== "out") {
    redirect("/override?status=invalid");
  }

  try {
    await appendCatEvent(event);
  } catch {
    redirect(`/override?status=error&event=${event}`);
  }

  redirect(`/override?status=success&event=${event}`);
}

type OverridePageProps = {
  searchParams: Promise<{
    status?: string;
    event?: string;
  }>;
};

export default async function OverridePage({
  searchParams,
}: OverridePageProps) {
  const { status: result, event } = await searchParams;

  const notice =
    result === "success"
      ? `Manual override saved. Baloo is now marked as ${
          event === "out" ? "outside" : "inside"
        }.`
      : result === "error"
      ? "The override could not be saved. Please try again."
      : result === "invalid"
      ? "Choose whether Baloo is inside or outside."
      : null;

  const noticeStyles =
    result === "success"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : "border-rose-400/40 bg-rose-500/10 text-rose-100";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-xl flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Set location
            </h1>
          </div>

          <Link
            href="/"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Home
          </Link>
        </div>

        {notice && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${noticeStyles}`}
          >
            {notice}
          </div>
        )}

        <form
          action={setCatLocation}
          className="rounded-3xl bg-slate-900 p-6 shadow-2xl"
        >
          <p className="text-lg font-semibold">Override current location</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button
              type="submit"
              name="event"
              value="in"
              className="rounded-2xl bg-sky-500 px-5 py-5 text-left text-sky-950 transition hover:bg-sky-400"
            >
              <span className="block text-3xl">🏠</span>
              <span className="mt-3 block text-xl font-bold">
                Mark as inside
              </span>
            </button>

            <button
              type="submit"
              name="event"
              value="out"
              className="rounded-2xl bg-emerald-400 px-5 py-5 text-left text-emerald-950 transition hover:bg-emerald-300"
            >
              <span className="block text-3xl">🌳</span>
              <span className="mt-3 block text-xl font-bold">
                Mark as outside
              </span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
