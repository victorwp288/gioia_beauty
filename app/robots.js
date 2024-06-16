export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/gallery", "/contacts"],
        disallow: ["/login", "/dashboard"],
      },
    ],
    sitemap: "https://gioia-beauty.vercel.app/sitemap.xml",
  };
}
