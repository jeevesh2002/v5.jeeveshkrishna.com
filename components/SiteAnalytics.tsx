"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

const measurementId = "G-ZX2M4QY3YR";
const sensitivePath = (path: string) => /^\/(?:unsubscribe|subscribe-confirm)(?:\/|$)/.test(path);

export default function SiteAnalytics() {
  const pathname = usePathname();
  const sensitive = sensitivePath(pathname);
  useEffect(() => {
    // Stop an already-loaded tag when navigating to a token-bearing route.
    const flags = window as unknown as Record<string, unknown>;
    flags[`ga-disable-${measurementId}`] = sensitive;
  }, [sensitive]);
  // Confirmation tokens must never be exposed to third-party scripts.
  if (sensitive) return null;
  return (
    <>
      <Analytics
        beforeSend={(event) => {
          const url = new URL(event.url);
          if (sensitivePath(url.pathname)) return null;
          url.search = "";
          url.hash = "";
          return { ...event, url: url.toString() };
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {page_location: location.origin + location.pathname});
    `}</Script>
    </>
  );
}
