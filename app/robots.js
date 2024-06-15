import { MetadataRoute } from "next";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      allow: "/gallery",
      disallow: "/login",
      disallow: "/dashboard",
    },
    sitemap: "https://gioia-beauty.vercel.app/sitemap.xml",
  };
}
