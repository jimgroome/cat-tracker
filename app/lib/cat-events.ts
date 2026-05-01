import { v4 as uuidv4 } from "uuid";

const VALID_EVENTS = ["out", "in", "unknown"] as const;

export type CatMovementEvent = (typeof VALID_EVENTS)[number];

export function isCatMovementEvent(value: unknown): value is CatMovementEvent {
  return typeof value === "string" && VALID_EVENTS.includes(value as CatMovementEvent);
}

export async function appendCatEvent(event: CatMovementEvent) {
  const response = await fetch(process.env.WEBAPP_URL!, {
    method: "POST",
    body: JSON.stringify({
      id: uuidv4(),
      event,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send event");
  }

  const data = await response.json();

  if (!data.ok) {
    throw new Error("Failed to send event");
  }
}
