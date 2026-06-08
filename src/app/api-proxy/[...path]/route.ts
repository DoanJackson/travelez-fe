import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://api.zsocial.id.vn";

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const search = request.nextUrl.search;
  const url = `${UPSTREAM}/${path.join("/")}${search}`;

  // Only forward Content-Type and Authorization.
  // Never spread request.headers — that would forward Host, X-Forwarded-*, cookies, etc.
  const cleanHeaders = new Headers();
  const contentType = request.headers.get("content-type");
  const authorization = request.headers.get("authorization");
  if (contentType) cleanHeaders.set("content-type", contentType);
  if (authorization) cleanHeaders.set("authorization", authorization);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const upstream = await fetch(url, {
    method: request.method,
    headers: cleanHeaders,
    body,
  });

  const data = await upstream.arrayBuffer();
  return new NextResponse(data, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
