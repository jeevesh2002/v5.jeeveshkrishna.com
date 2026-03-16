import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const country = request.geo?.country;

  // Allow if country is unknown (local dev) or US
  if (!country || country === "US") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/blocked", request.url));
}

export const config = {
  // Run on all routes except /blocked itself, static assets, and Next.js internals
  matcher: "/((?!blocked|_next/static|_next/image|favicon.ico).*)",
};
