import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const baseUrl = process.env.UKSHOP_API_URL ?? "http://localhost:3000/api/v1";
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/newsletter/unsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return NextResponse.json(await response.json().catch(() => ({})), { status: response.status });
  } catch {
    return NextResponse.json({ message: "Unsubscribe request could not be completed." }, { status: 503 });
  }
}