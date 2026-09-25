const fs = require("fs");
const path = require("path");

const crawl = JSON.parse(fs.readFileSync(".firecrawl/crawl.json", "utf8"));
const urls = [
  ...new Set(
    crawl.data
      .map((p) => p.metadata?.sourceURL || p.metadata?.url)
      .filter((u) => u && !u.endsWith("/sitemap.xml"))
  ),
];

const extras = [
  "https://www.instabizweb.com/faq",
  "https://www.instabizweb.com/faqs",
  "https://www.instabizweb.com/pricing",
  "https://www.instabizweb.com/careers",
  "https://www.instabizweb.com/jobs",
  "https://www.instabizweb.com/team",
  "https://www.instabizweb.com/blog",
  "https://www.instabizweb.com/case-studies",
  "https://www.instabizweb.com/case-study",
  "https://www.instabizweb.com/resources",
  "https://www.instabizweb.com/downloads",
  "https://www.instabizweb.com/llms.txt",
  "https://www.instabizweb.com/feed",
  "https://www.instabizweb.com/rss.xml",
  "https://www.instabizweb.com/sitemap",
  "https://www.instabizweb.com/thank-you",
  "https://www.instabizweb.com/cookies",
  "https://www.instabizweb.com/cookie-policy",
];

const outDir = ".firecrawl/html";
fs.mkdirSync(outDir, { recursive: true });

function fileFor(url) {
  const u = new URL(url);
  let p = u.pathname.replace(/\/$/, "") || "/index";
  if (p === "/") p = "/index";
  return path.join(outDir, p.replace(/^\//, "").replace(/[<>:"|?*]/g, "_") + ".html");
}

async function fetchOne(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "Mozilla/5.0 (compatible; InstabizContentArchive/1.0)" },
  });
  const buf = Buffer.from(await res.arrayBuffer());
  const dest = fileFor(url);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return { url, status: res.status, final: res.url, bytes: buf.length, file: dest };
}

async function pool(items, n, fn) {
  const ret = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      try {
        ret[idx] = await fn(items[idx]);
      } catch (err) {
        ret[idx] = { url: items[idx], error: String(err) };
      }
    }
  }
  await Promise.all(Array.from({ length: n }, worker));
  return ret;
}

(async () => {
  const results = await pool([...urls, ...extras], 8, fetchOne);
  fs.writeFileSync(".firecrawl/html-fetch.json", JSON.stringify(results, null, 2));
  for (const r of results) {
    console.log(`${r.status || "ERR"}\t${r.bytes || 0}\t${r.final || r.error}\t${r.url}`);
  }
})();
