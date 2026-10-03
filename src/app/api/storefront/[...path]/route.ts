import { NextRequest, NextResponse } from "next/server";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";
const ALLOWED_NAMESPACES = new Set([
  "addresses",
  "auth",
  "cart",
  "me",
  "newsletter",
  "orders",
  "payments",
  "returns",
  "reviews",
  "shipping-methods",
  "wishlist",
]);

async function proxy(request: NextRequest, path: string[], method: Method) {
  if (!ALLOWED_NAMESPACES.has(path[0])) {
    return NextResponse.json({ error: { message: "Not found.", code: "NOT_FOUND" } }, { status: 404 });
  }

  const baseUrl = process.env.UKSHOP_API_URL ?? "http://localhost:3000/api/v1";
  const apiUrl = `${baseUrl.replace(/\/+$/, "")}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const headers = new Headers();
  for (const name of ["accept", "authorization", "content-type", "idempotency-key", "x-guest-token"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  try {
    const upstream = await fetch(apiUrl, {
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer(),
      cache: "no-store",
    });
    const responseHeaders = new Headers();
    responseHeaders.set("cache-control", "no-store");
    for (const name of ["content-disposition", "content-type"]) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    const noBody = method === "HEAD" || [204, 205, 304].includes(upstream.status);
    return new Response(noBody ? null : await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      { error: { message: "The storefront API is unavailable.", code: "API_UNAVAILABLE" } },
      { status: 503 },
    );
  }
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path, "GET");
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path, "POST");
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path, "PUT");
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path, "PATCH");
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path, "DELETE");
}

export async function HEAD(request: NextRequest, context: RouteContext) {
  return proxy(request, (await context.params).path, "HEAD");
}