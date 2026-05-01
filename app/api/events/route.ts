import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CATFLAP_API_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!["out", "in", "unknown"].includes(body.event)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }
  const response = await fetch(process.env.WEBAPP_URL!, {
    method: "POST",
    body: JSON.stringify({
      id: uuidv4(),
      event: body.event,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to send event" },
      { status: 500 }
    );
  }

  const data = await response.json();

  if (!data.ok) {
    return NextResponse.json(
      { error: "Failed to send event" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
