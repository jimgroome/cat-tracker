import { NextRequest, NextResponse } from "next/server";
import { appendCatEvent, isCatMovementEvent } from "@/app/lib/cat-events";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CATFLAP_API_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!isCatMovementEvent(body.event)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  try {
    await appendCatEvent(body.event);
  } catch {
    return NextResponse.json(
      { error: "Failed to send event" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
