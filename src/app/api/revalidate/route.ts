import { createHash, timingSafeEqual } from "crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { isKnownCacheTag, isRevalidatablePath } from "@/lib/cache-tags";

const MAX_ITEMS = 50;

function authorised(request: Request): boolean {
  const secret = process.env.REVALIDATION_SECRET;
  const header = request.headers.get("authorization") ?? "";
  if (!secret || !header.startsWith("Bearer ")) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(header.slice("Bearer ".length)), digest(secret));
}

export async function POST(request: Request) {
  if (!process.env.REVALIDATION_SECRET) {
    console.error("[REVALIDATION] status=disabled reason=REVALIDATION_SECRET not set");
    return NextResponse.json({ message: "Revalidation is not configured." }, { status: 503 });
  }
  if (!authorised(request)) return NextResponse.json({ message: "Unauthorised" }, { status: 401 });

  let body: { tags?: unknown; paths?: unknown };
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
    body = parsed as { tags?: unknown; paths?: unknown };
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }
  const tags = Array.isArray(body.tags) ? body.tags : [];
  const paths = Array.isArray(body.paths) ? body.paths : [];
  if (!tags.length && !paths.length) return NextResponse.json({ message: "Give at least one tag or path." }, { status: 400 });
  if (tags.length + paths.length > MAX_ITEMS) return NextResponse.json({ message: `At most ${MAX_ITEMS} tags and paths per request.` }, { status: 400 });
  const invalidTags = tags.filter((tag) => !isKnownCacheTag(tag));
  const invalidPaths = paths.filter((path) => !isRevalidatablePath(path));
  if (invalidTags.length || invalidPaths.length) {
    console.warn(`[REVALIDATION] status=rejected invalidTags=${JSON.stringify(invalidTags).slice(0, 300)} invalidPaths=${JSON.stringify(invalidPaths).slice(0, 300)}`);
    return NextResponse.json({ message: "Unknown tag or invalid path.", invalidTags, invalidPaths }, { status: 400 });
  }

  try {
    for (const tag of tags as string[]) revalidateTag(tag, { expire: 0 });
    for (const path of paths as string[]) revalidatePath(path);
  } catch (error) {
    console.error(`[REVALIDATION] status=failed tags=${tags.join(",")} paths=${paths.join(",")} error=${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json({ message: "Revalidation failed." }, { status: 500 });
  }
  console.info(`[REVALIDATION] status=success tags=${tags.join(",") || "-"} paths=${paths.join(",") || "-"}`);
  return NextResponse.json({ revalidated: { tags, paths } });
}