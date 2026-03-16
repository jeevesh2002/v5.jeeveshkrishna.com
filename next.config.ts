import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent DNS prefetch leaking which resources this page loads
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Force HTTPS for 2 years, include subdomains, apply to preload list
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Block this page from being embedded in iframes (clickjacking prevention)
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent browsers from MIME-sniffing the content-type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send the origin (no path) in the Referer header to external sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features this site doesn't use
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' required for Next.js hydration scripts and the theme init script
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
      // 'unsafe-inline' required for Next.js styled-jsx; Google Fonts CSS
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "frame-src 'self'",
      // Block Flash, Java applets, and other plugins
      "object-src 'none'",
      // Prevent base tag injection attacks (attacker redirecting all relative URLs)
      "base-uri 'self'",
      // Prevent forms from submitting to external domains
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Don't advertise the tech stack
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
