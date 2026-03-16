import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600", "700"], display: "swap" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", weight: ["400", "500", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Jeevesh Krishna Arigala", template: "%s · Jeevesh Krishna Arigala" },
  description: "Computer scientist. I build infrastructure and security systems, and think seriously about how technology shapes civilizational outcomes.",
  authors: [{ name: "Jeevesh Krishna Arigala" }],
  openGraph: { siteName: "Jeevesh Krishna Arigala", type: "website" },
};

// Runs synchronously before paint - prevents flash of wrong theme
const themeScript = `(function(){
  try {
    var s = localStorage.getItem('theme');
    var d = document.documentElement;
    d.classList.add('no-transition');
    if (s === 'dark' || (!s && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
      d.setAttribute('data-theme','dark');
      d.style.colorScheme = 'dark';
    } else {
      d.setAttribute('data-theme','light');
      d.style.colorScheme = 'light';
    }
    requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.remove('no-transition');});});
  } catch(e) {}
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <body>
        {/* Must be first child - prevents flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Nav />
        <main style={{ paddingTop: "56px", minHeight: "100vh" }}>
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
