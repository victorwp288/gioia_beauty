export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/gallery", "/contacts"],
        disallow: ["/login", "/dashboard"],
      },
    ],
    sitemap: "https://www.gioiabeauty.net/sitemap.xml",
  };
}
