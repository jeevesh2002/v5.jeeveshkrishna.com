import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Vercel injects the visitor's country into this header automatically
  const country = request.headers.get("x-vercel-ip-country");

  // Allow if header is absent (local dev) or country is US
  if (!country || country === "US") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/blocked", request.url));
}

export const config = {
  // Run on all routes except /blocked itself, static assets, and Next.js internals
  matcher: "/((?!blocked|_next/static|_next/image|favicon.ico).*)",
};
