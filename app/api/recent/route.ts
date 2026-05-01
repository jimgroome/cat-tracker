import { google } from "googleapis";
import { NextResponse } from "next/server";

type SheetRow = [string, string, string];

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Events!A:C",
    });

    const rows = res.data.values as SheetRow[] | undefined;

    if (!rows || rows.length <= 1) {
      return NextResponse.json([]);
    }

    const events = rows
      .filter(([id, timestamp, event]) => id && timestamp && event)
      .map(([id, timestamp, event]) => ({
        id,
        timestamp,
        event,
      }))
      .reverse()
      .slice(0, 20);

    return NextResponse.json(events);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to fetch recent events" },
      { status: 500 }
    );
  }
}
