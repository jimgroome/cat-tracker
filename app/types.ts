export type CatEvent = {
  id: string;
  timestamp: string;
  event: "out" | "in" | "unknown";
};
