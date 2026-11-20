export const metadata = (title: string, description: string) => ({
  meta: [
    { title: `${title} · Entangle` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · Entangle` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
