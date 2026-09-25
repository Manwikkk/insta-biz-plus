const fs = require("fs");
const crawl = JSON.parse(fs.readFileSync(".firecrawl/crawl.json", "utf8"));
const pages = crawl.data;

function pathOf(url) {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

const rows = pages.map((p) => {
  const url = p.metadata?.sourceURL || p.metadata?.url || "";
  const md = p.markdown || "";
  const glued = (md.match(/[a-z][A-Z]/g) || []).length;
  return {
    url,
    title: p.metadata?.title || "",
    status: p.metadata?.statusCode,
    md: md.length,
    links: (p.links || []).length,
    images: (p.images || []).length,
    glued,
    canonical: p.metadata?.canonical || p.metadata?.["og:url"] || "",
    robots: p.metadata?.robots || "",
  };
});

rows.sort((a, b) => a.url.localeCompare(b.url));
console.log(JSON.stringify(rows, null, 2));

const internal = new Set();
for (const p of pages) {
  for (const link of p.links || []) {
    if (typeof link === "string" && link.includes("instabizweb.com")) internal.add(link.split("#")[0]);
  }
}
console.log("\nUNIQUE INTERNAL LINKS", internal.size);
const crawled = new Set(rows.map((r) => r.url.replace(/\/$/, "")));
const missing = [...internal]
  .map((u) => u.replace(/\/$/, ""))
  .filter((u) => u.startsWith("https://www.instabizweb.com"))
  .filter((u) => !u.includes("/_next/") && !u.endsWith(".xml") && !u.endsWith(".png") && !u.endsWith(".jpg") && !u.endsWith(".webp") && !u.endsWith(".ico"))
  .filter((u) => !crawled.has(u) && !crawled.has(u + "/"));
console.log("POSSIBLY MISSING");
console.log([...new Set(missing)].sort().join("\n"));
