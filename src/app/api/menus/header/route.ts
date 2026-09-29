import { NextResponse } from "next/server";
import { fetchHeaderMenu } from "@/lib/api";

export async function GET() {
  try {
    return NextResponse.json(await fetchHeaderMenu());
  } catch {
    return NextResponse.json({ items: [] });
  }
}