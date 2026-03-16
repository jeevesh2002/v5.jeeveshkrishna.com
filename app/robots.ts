import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block access to the API from crawlers
        disallow: "/api/",
      },
    ],
    sitemap: "https://jeeveshkrishna.com/sitemap.xml",
  };
}
