import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description:
    "Computer scientist. I build infrastructure and security systems, and think seriously about how technology shapes civilizational outcomes.",
  authors: [{ name: siteConfig.name }],
  openGraph: { siteName: siteConfig.name, type: "website" },
  alternates: {
    types: {
      "application/rss+xml": `${siteConfig.siteUrl}/feed.xml`,
    },
  },
};

// Runs synchronously before paint - prevents flash of wrong theme
const themeScript = `(function(){
  try {
    var s = localStorage.getItem('theme');
    var d = document.documentElement;
    if (s === 'dark' || (!s && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
      d.setAttribute('data-theme','dark');
    } else {
      d.setAttribute('data-theme','light');
    }
  } catch(e) {}
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <body>
        {/* Must be first child - prevents flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Nav />
        <main style={{ paddingTop: "56px", minHeight: "100vh" }}>{children}</main>
        <Footer />
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  );
}
