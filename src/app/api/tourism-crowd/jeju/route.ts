import { NextResponse } from "next/server";

export const revalidate = 21600;

export async function GET() {
  return NextResponse.json({
    forecasts: [],
    summaries: [],
    status: "not-connected",
  });
}
