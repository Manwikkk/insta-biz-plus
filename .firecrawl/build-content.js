const fs = require("fs");
const path = require("path");
const cheerio = require("./tools/node_modules/cheerio");

const ROOT = path.resolve("website-content");
const HTML_DIR = path.resolve(".firecrawl/html");
const crawl = JSON.parse(fs.readFileSync(".firecrawl/crawl.json", "utf8"));
const sitemapXml = fs.readFileSync(".firecrawl/sitemap.xml", "utf8");
const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

const LOCATION_SLUGS = new Set([
  "web-development-company-in-ahmedabad",
  "software-development-company-in-ahmedabad",
  "mobile-app-development-company-in-ahmedabad",
  "odoo-implementation-company-in-ahmedabad",
  "digital-marketing-agency-in-ahmedabad",
  "seo-company-in-ahmedabad",
]);

function decode(s) {
  return String(s || "")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&rdquo;/g, "”")
    .replace(/&ldquo;/g, "“")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function decodeCf(hex) {
  if (!hex || hex.length < 4) return "";
  const key = parseInt(hex.slice(0, 2), 16);
  let out = "";
  for (let i = 2; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  }
  return out;
}

function findCf(node) {
  if (!node || node.type !== "tag") return "";
  if (node.attribs && node.attribs["data-cfemail"]) return decodeCf(node.attribs["data-cfemail"]);
  for (const child of node.children || []) {
    const found = findCf(child);
    if (found) return found;
  }
  return "";
}

function absUrl(href, base) {
  if (!href) return "";
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

function originalImage(src, base) {
  const abs = absUrl(src, base);
  try {
    const u = new URL(abs);
    if (u.pathname.includes("/_next/image")) {
      const raw = u.searchParams.get("url");
      if (raw) return absUrl(raw, base);
    }
  } catch {}
  return abs;
}

function collapse(s) {
  return decode(s).replace(/\s+/g, " ").trim();
}

function joinParts(parts) {
  let out = "";
  for (const part of parts) {
    if (!part) continue;
    if (!out) {
      out = part;
      continue;
    }
    const left = out.slice(-1);
    const right = part[0];
    if (!left || !right || /\s/.test(left) || /\s/.test(right)) {
      out += part;
      continue;
    }
    const rightPunct = /^[.,;:!?%\)\]\/’]/.test(part);
    const leftOpen = /[\(\[\/‘“"']$/.test(out);
    out += !rightPunct && !leftOpen ? " " + part : part;
  }
  return out;
}

const SKIP = new Set(["script", "style", "svg", "noscript", "template", "iframe", "video", "source", "canvas"]);
const BLOCK = new Set([
  "address", "article", "aside", "blockquote", "div", "dl", "fieldset", "figcaption", "figure",
  "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "li", "main", "nav",
  "ol", "p", "pre", "section", "table", "tbody", "thead", "tr", "ul", "details", "summary",
]);

function render(node, $, base, ctx) {
  if (!node) return "";
  if (node.type === "text") return node.data || "";
  if (node.type !== "tag") return "";
  const name = node.name;
  if (SKIP.has(name)) return "";
  if (node.attribs && (node.attribs["aria-hidden"] === "true" || node.attribs.hidden === "")) return "";

  if (name === "br") return "\n";
  if (name === "img") {
    const alt = collapse(node.attribs.alt || "");
    const src = originalImage(node.attribs.src || node.attribs["data-src"] || "", base);
    const title = collapse(node.attribs.title || "");
    ctx.images.push({ alt, src, title, caption: "" });
    if (!src && !alt) return "";
    return alt ? `[Image: ${alt}](${src})` : `[Image](${src})`;
  }

  if (name === "span" && node.attribs["data-cfemail"]) return decodeCf(node.attribs["data-cfemail"]);

  if (name === "a") {
    let href = absUrl(node.attribs.href || "", base);
    const cf = findCf(node);
    if (cf && href.includes("email-protection")) href = `mailto:${cf}`;
    const inner = collapse(joinParts((node.children || []).map((c) => render(c, $, base, ctx))));
    if (href) ctx.links.push({ text: inner, href });
    if (!inner) return "";
    if (!href || href.startsWith("javascript:")) return inner;
    return `[${inner}](${href})`;
  }

  if (name === "button") {
    const inner = collapse(joinParts((node.children || []).map((c) => render(c, $, base, ctx))));
    if (inner) ctx.buttons.push(inner);
    return inner;
  }

  if (/^h[1-6]$/.test(name)) {
    const level = Number(name[1]);
    const inner = collapse(joinParts((node.children || []).map((c) => render(c, $, base, ctx))));
    if (!inner) return "";
    ctx.headings.push({ level, text: inner });
    return `\n\n${"#".repeat(level)} ${inner}\n\n`;
  }

  if (name === "li") {
    const inner = collapse(joinParts((node.children || []).map((c) => render(c, $, base, ctx))));
    if (!inner) return "";
    const marker = ctx.listType === "ol" ? `${ctx.listIndex}. ` : "- ";
    return `\n${marker}${inner}`;
  }

  if (name === "ul" || name === "ol") {
    const prev = ctx.listType;
    const prevIndex = ctx.listIndex;
    ctx.listType = name;
    ctx.listIndex = 1;
    const items = [];
    for (const child of node.children || []) {
      if (child.type === "tag" && child.name === "li") {
        items.push(render(child, $, base, ctx));
        ctx.listIndex += 1;
      }
    }
    ctx.listType = prev;
    ctx.listIndex = prevIndex;
    return `\n${items.join("")}\n`;
  }

  if (name === "pre") {
    const inner = (node.children || []).map((c) => (c.type === "text" ? c.data : cheerio.load(c).text())).join("");
    return `\n\n\`\`\`\n${inner.trim()}\n\`\`\`\n\n`;
  }

  if (name === "table") {
    const rows = [];
    $(node).find("tr").each((_, tr) => {
      const cells = [];
      $(tr).find("th,td").each((__, cell) => {
        cells.push(collapse($(cell).text()));
      });
      if (cells.length) rows.push(cells);
    });
    if (!rows.length) return "";
    const width = Math.max(...rows.map((r) => r.length));
    const norm = rows.map((r) => {
      while (r.length < width) r.push("");
      return `| ${r.join(" | ")} |`;
    });
    const sep = `| ${Array(width).fill("---").join(" | ")} |`;
    return `\n\n${norm[0]}\n${sep}\n${norm.slice(1).join("\n")}\n\n`;
  }

  if (name === "summary") {
    const inner = collapse(joinParts((node.children || []).map((c) => render(c, $, base, ctx))));
    return inner ? `\n\n**${inner}**\n\n` : "";
  }

  const parts = (node.children || []).map((c) => render(c, $, base, ctx));
  const inner = joinParts(parts);
  if (BLOCK.has(name)) {
    const trimmed = inner.trim();
    if (!trimmed) return "";
    if (name === "p" || name === "blockquote" || name === "figcaption" || name === "address") {
      return `\n\n${collapse(trimmed)}\n\n`;
    }
    return `\n${trimmed}\n`;
  }
  return inner;
}

function cleanMarkdown(md) {
  return decode(md)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function metaContent($, name) {
  const el =
    $(`meta[name="${name}"]`).attr("content") ||
    $(`meta[property="${name}"]`).attr("content") ||
    $(`meta[name="${name.toLowerCase()}"]`).attr("content") ||
    "";
  return decode(el).trim();
}

function extractForms($, base) {
  const forms = [];
  $("form").each((i, form) => {
    const fields = [];
    $(form).find("input, textarea, select").each((_, el) => {
      const tag = el.name;
      const type = (el.attribs.type || tag).toLowerCase();
      if (["hidden", "submit", "button"].includes(type)) return;
      const options = [];
      if (tag === "select") {
        $(el).find("option").each((__, opt) => options.push(collapse($(opt).text())));
      }
      fields.push({
        tag,
        type,
        name: el.attribs.name || "",
        placeholder: decode(el.attribs.placeholder || ""),
        required: el.attribs.required !== undefined,
        label: "",
        options,
      });
    });
    const chips = [];
    $(form).find("button").each((_, btn) => {
      const type = (btn.attribs.type || "submit").toLowerCase();
      const label = collapse($(btn).text());
      if (!label) return;
      if (type === "submit") chips.push({ role: "submit", label });
      else chips.push({ role: "option", label });
    });
    const labels = [];
    $(form).find("label").each((_, lab) => labels.push(collapse($(lab).text())));
    const notes = [];
    $(form).find("p").each((_, p) => {
      const text = collapse($(p).text());
      if (text) notes.push(text);
    });
    forms.push({ index: i + 1, fields, chips, labels, notes, action: absUrl(form.attribs.action || "", base), method: form.attribs.method || "" });
  });
  return forms;
}

function extractJsonLd($) {
  const blocks = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).text().trim();
    if (!raw) return;
    try {
      blocks.push(JSON.parse(raw));
    } catch {
      blocks.push({ _raw: raw, _parseError: true });
    }
  });
  return blocks;
}

function extractMedia($, base) {
  const images = [];
  $("img").each((_, img) => {
    if (img.attribs["aria-hidden"] === "true") return;
    const alt = collapse(img.attribs.alt || "");
    const title = collapse(img.attribs.title || "");
    const src = originalImage(img.attribs.src || "", base);
    let caption = "";
    const fig = $(img).closest("figure");
    if (fig.length) caption = collapse(fig.find("figcaption").first().text());
    if (src || alt) images.push({ alt, title, caption, src });
  });
  const videos = [];
  $("iframe, video, source").each((_, el) => {
    const src = absUrl(el.attribs.src || "", base);
    if (!src) return;
    videos.push({ tag: el.name, src, title: collapse(el.attribs.title || "") });
  });
  return { images, videos };
}

function pageKind(pathname) {
  const p = pathname.replace(/\/$/, "") || "/";
  if (p === "/") return { type: "Homepage", folder: "", file: "homepage.md" };
  if (p === "/services") return { type: "Services index", folder: "services", file: "index.md" };
  if (p.startsWith("/services/")) return { type: "Service page", folder: "services", file: path.basename(p) + ".md" };
  if (LOCATION_SLUGS.has(p.slice(1))) return { type: "Location service page", folder: "locations", file: path.basename(p) + ".md" };
  if (p === "/solutions") return { type: "Solutions index", folder: "solutions", file: "index.md" };
  if (p.startsWith("/solutions/")) return { type: "Industry / solution page", folder: "solutions", file: path.basename(p) + ".md" };
  if (p === "/portfolio") return { type: "Portfolio", folder: "portfolio", file: "portfolio.md" };
  if (p === "/blogs") return { type: "Blog index", folder: "blog", file: "index.md" };
  if (p.startsWith("/blogs/")) return { type: "Blog article", folder: "blog", file: path.basename(p) + ".md" };
  if (p === "/about-us") return { type: "About", folder: "about", file: "about-us.md" };
  if (p === "/contact-us") return { type: "Contact", folder: "contact", file: "contact-us.md" };
  if (p === "/audit") return { type: "Landing page", folder: "other", file: "free-website-audit.md" };
  if (["/privacy-policy", "/terms-and-conditions", "/refund-policy"].includes(p)) {
    return { type: "Legal", folder: "legal", file: path.basename(p) + ".md" };
  }
  return { type: "Other", folder: "other", file: path.basename(p) + ".md" };
}

function htmlPath(url) {
  const u = new URL(url);
  let p = u.pathname.replace(/\/$/, "") || "/index";
  if (p === "/") p = "/index";
  return path.join(HTML_DIR, p.replace(/^\//, "") + ".html");
}

function bullets(items) {
  return items.filter(Boolean).map((x) => `- ${x}`).join("\n");
}

function buildPage(url) {
  const html = fs.readFileSync(htmlPath(url), "utf8");
  const $ = cheerio.load(html);
  const kind = pageKind(new URL(url).pathname);
  const ctx = { images: [], links: [], buttons: [], headings: [], listType: "ul", listIndex: 1 };
  const mainEl = $("main").get(0);
  const mainMd = cleanMarkdown(mainEl ? render(mainEl, $, url, ctx) : "");
  const headerCtx = { images: [], links: [], buttons: [], headings: [], listType: "ul", listIndex: 1 };
  const footerCtx = { images: [], links: [], buttons: [], headings: [], listType: "ul", listIndex: 1 };
  const headerMd = cleanMarkdown($("header").get(0) ? render($("header").get(0), $, url, headerCtx) : "");
  const footerMd = cleanMarkdown($("footer").get(0) ? render($("footer").get(0), $, url, footerCtx) : "");

  const title = collapse($("title").first().text());
  const h1 = ctx.headings.find((h) => h.level === 1)?.text || collapse($("h1").first().text());
  const description = metaContent($, "description");
  const canonical = absUrl($('link[rel="canonical"]').attr("href") || "", url);
  const robots = metaContent($, "robots");
  const googlebot = metaContent($, "googlebot");
  const author = metaContent($, "author");
  const keywords = metaContent($, "keywords");
  const og = {
    title: metaContent($, "og:title"),
    description: metaContent($, "og:description"),
    url: metaContent($, "og:url"),
    type: metaContent($, "og:type"),
    image: metaContent($, "og:image"),
    imageAlt: metaContent($, "og:image:alt"),
    siteName: metaContent($, "og:site_name"),
    locale: metaContent($, "og:locale"),
  };
  const twitter = {
    card: metaContent($, "twitter:card"),
    title: metaContent($, "twitter:title"),
    description: metaContent($, "twitter:description"),
    image: metaContent($, "twitter:image"),
    site: metaContent($, "twitter:site"),
    creator: metaContent($, "twitter:creator"),
  };
  const published =
    metaContent($, "article:published_time") ||
    $("time[datetime]").first().attr("datetime") ||
    "";
  const modified = metaContent($, "article:modified_time") || "";
  const forms = extractForms($, url);
  const jsonLd = extractJsonLd($);
  const media = extractMedia($, url);
  const breadcrumb = collapse($('[aria-label="breadcrumb"], nav.breadcrumb, .breadcrumb').first().text());

  const faqs = [];
  $("details").each((_, det) => {
    const q = collapse($(det).find("summary").first().text());
    const a = collapse($(det).clone().find("summary").remove().end().text());
    if (q) faqs.push({ q, a });
  });

  const article = jsonLd.find((b) => {
    const t = b["@type"];
    return t === "BlogPosting" || t === "Article" || (Array.isArray(t) && t.includes("BlogPosting"));
  });

  const crawlPage = crawl.data.find((p) => (p.metadata?.sourceURL || "").replace(/\/$/, "") === url.replace(/\/$/, ""));
  const fireMeta = crawlPage?.metadata || {};

  return {
    url,
    kind,
    title,
    h1,
    description,
    canonical,
    robots,
    googlebot,
    author,
    keywords,
    og,
    twitter,
    published,
    modified,
    forms,
    jsonLd,
    media,
    breadcrumb,
    faqs,
    article,
    mainMd,
    headerMd,
    footerMd,
    headings: ctx.headings,
    links: dedupeLinks([...ctx.links, ...headerCtx.links, ...footerCtx.links]),
    buttons: [...new Set([...ctx.buttons, ...headerCtx.buttons])],
    fireMeta,
    status: fireMeta.statusCode || 200,
  };
}

function dedupeLinks(links) {
  const seen = new Set();
  const out = [];
  for (const l of links) {
    const key = `${l.text}|${l.href}`;
    if (!l.href || seen.has(key)) continue;
    seen.add(key);
    out.push(l);
  }
  return out;
}

function section(title, body) {
  if (!body || !String(body).trim()) return "";
  return `\n## ${title}\n\n${String(body).trim()}\n`;
}

function pageMarkdown(page) {
  const info = [
    `- URL: ${page.url}`,
    `- Page Type: ${page.kind.type}`,
    page.title ? `- Meta Title: ${page.title}` : "",
    page.description ? `- Meta Description: ${page.description}` : "",
    page.canonical ? `- Canonical URL: ${page.canonical}` : "",
    page.robots ? `- Robots: ${page.robots}` : "",
    page.author ? `- Author meta: ${page.author}` : "",
    page.published ? `- Published: ${page.published}` : "",
    page.modified ? `- Updated: ${page.modified}` : "",
    page.article?.author ? `- Article author: ${typeof page.article.author === "string" ? page.article.author : page.article.author?.name || JSON.stringify(page.article.author)}` : "",
    page.article?.datePublished ? `- Article datePublished: ${page.article.datePublished}` : "",
    page.article?.dateModified ? `- Article dateModified: ${page.article.dateModified}` : "",
    page.article?.articleSection ? `- Category: ${page.article.articleSection}` : "",
    Array.isArray(page.article?.keywords) ? `- Tags: ${page.article.keywords.join(", ")}` : page.article?.keywords ? `- Tags: ${page.article.keywords}` : "",
  ].filter(Boolean).join("\n");

  const faqMd = page.faqs.length
    ? page.faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")
    : "";

  const cta = [...new Set(page.buttons)].filter((b) => b && b.length < 120);
  const formMd = page.forms.map((form) => {
    const lines = [`### Form ${form.index}`];
    if (form.method || form.action) lines.push(`- Action: ${form.method || "GET"} ${form.action || "(same page)"}`.trim());
    if (form.labels.length) lines.push(`- Labels: ${form.labels.join("; ")}`);
    for (const note of form.notes || []) lines.push(`- Disclaimer: ${note}`);
    for (const f of form.fields) {
      const bits = [
        f.placeholder || f.name || f.type,
        `type: ${f.type}`,
        f.name ? `name: ${f.name}` : "",
        f.required ? "required" : "optional",
        f.options.length ? `options: ${f.options.join(", ")}` : "",
      ].filter(Boolean);
      lines.push(`- Field: ${bits.join(" | ")}`);
    }
    for (const c of form.chips) lines.push(`- ${c.role === "submit" ? "Submit button" : "Option"}: ${c.label}`);
    lines.push("- Success message: [NOT EXTRACTED] — not present in the server-rendered HTML.");
    lines.push("- Error message: [NOT EXTRACTED] — not present in the server-rendered HTML.");
    return lines.join("\n");
  }).join("\n\n");

  const mediaMd = [
    ...page.media.images.map((img) =>
      [`- Image: ${img.alt || "(no alt text)"}`, img.alt ? `  - Alt text: ${img.alt}` : "  - Alt text: (none)", img.title ? `  - Title: ${img.title}` : "", img.caption ? `  - Caption: ${img.caption}` : "", `  - Source URL: ${img.src}`].filter(Boolean).join("\n")
    ),
    ...page.media.videos.map((v) => `- ${v.tag}: ${v.title || "(no title)"} — ${v.src}`),
  ].join("\n");

  const internal = page.links.filter((l) => l.href.includes("instabizweb.com"));
  const external = page.links.filter((l) => /^https?:/i.test(l.href) && !l.href.includes("instabizweb.com"));
  const downloads = page.links.filter((l) => /\.(pdf|docx?|xlsx?|zip|csv)(\?|$)/i.test(l.href));

  const schema = page.jsonLd.length ? "```json\n" + JSON.stringify(page.jsonLd, null, 2) + "\n```" : "";

  const extra = [
    page.og.title ? `- Open Graph title: ${page.og.title}` : "",
    page.og.description ? `- Open Graph description: ${page.og.description}` : "",
    page.og.url ? `- Open Graph URL: ${page.og.url}` : "",
    page.og.type ? `- Open Graph type: ${page.og.type}` : "",
    page.og.image ? `- Open Graph image: ${page.og.image}` : "",
    page.og.imageAlt ? `- Open Graph image alt: ${page.og.imageAlt}` : "",
    page.og.siteName ? `- Open Graph site name: ${page.og.siteName}` : "",
    page.og.locale ? `- Open Graph locale: ${page.og.locale}` : "",
    page.twitter.card ? `- Twitter card: ${page.twitter.card}` : "",
    page.twitter.title ? `- Twitter title: ${page.twitter.title}` : "",
    page.twitter.description ? `- Twitter description: ${page.twitter.description}` : "",
    page.twitter.image ? `- Twitter image: ${page.twitter.image}` : "",
    page.twitter.site ? `- Twitter site: ${page.twitter.site}` : "",
    page.twitter.creator ? `- Twitter creator: ${page.twitter.creator}` : "",
    page.googlebot ? `- Googlebot: ${page.googlebot}` : "",
    page.keywords ? `- Meta keywords: ${page.keywords}` : "",
    page.breadcrumb ? `- Breadcrumb: ${page.breadcrumb}` : "",
  ].filter(Boolean).join("\n");

  const heading = page.h1 || page.title || page.url;
  return [
    `# ${heading}`,
    section("Page Information", info).trim(),
    section("Main Content", page.mainMd || "[NOT EXTRACTED] No <main> content found."),
    faqMd ? section("FAQs", faqMd).trim() : "",
    cta.length ? section("Calls to Action", bullets(cta)).trim() : "",
    formMd ? section("Forms", formMd).trim() : "",
    mediaMd ? section("Media Content", mediaMd).trim() : "",
    downloads.length ? section("Downloads", bullets(downloads.map((d) => `${d.text || "File"}: ${d.href}`))).trim() : "",
    internal.length ? section("Internal Links", bullets(internal.map((l) => `${l.text || "(no text)"}: ${l.href}`))).trim() : "",
    external.length ? section("External Links", bullets(external.map((l) => `${l.text || "(no text)"}: ${l.href}`))).trim() : "",
    section("Shared site chrome", "Navigation and footer text on this page is duplicated site-wide. The shared wording is stored in `global-content.md`. It is repeated here so this page file stays complete.\n\n### Navigation\n\n" + (page.headerMd || "[NOT EXTRACTED]") + "\n\n### Footer\n\n" + (page.footerMd || "[NOT EXTRACTED]")).trim(),
    extra ? section("Additional Metadata", extra).trim() : "",
    schema ? section("Structured Data", schema).trim() : "",
  ].filter(Boolean).join("\n\n") + "\n";
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

const contentUrls = sitemapUrls.filter((u) => !u.endsWith(".xml"));
const pages = contentUrls.map(buildPage);

for (const page of pages) {
  const rel = page.kind.folder ? path.join(page.kind.folder, page.kind.file) : page.kind.file;
  const dest = path.join(ROOT, rel);
  ensureDir(dest);
  fs.writeFileSync(dest, pageMarkdown(page), "utf8");
  page.rel = rel.replace(/\\/g, "/");
}

const llms = fs.readFileSync(path.join(HTML_DIR, "llms.txt.html"), "utf8");
ensureDir(path.join(ROOT, "other/llms.md"));
fs.writeFileSync(
  path.join(ROOT, "other/llms.md"),
  `# llms.txt\n\n## Page Information\n\n- URL: https://www.instabizweb.com/llms.txt\n- Page Type: Machine-readable site summary\n- Canonical URL: https://www.instabizweb.com/llms.txt\n\n## Main Content\n\n${llms.trim()}\n`,
  "utf8"
);

const home = pages.find((p) => p.kind.file === "homepage.md");
const contact = pages.find((p) => p.url.endsWith("/contact-us"));
const about = pages.find((p) => p.url.endsWith("/about-us"));

const ctaCounts = new Map();
for (const p of pages) {
  for (const b of new Set(p.buttons)) {
    if (!b || b.length > 80) continue;
    ctaCounts.set(b, (ctaCounts.get(b) || 0) + 1);
  }
}
const repeatedCtas = [...ctaCounts.entries()].filter(([, n]) => n >= 8).sort((a, b) => b[1] - a[1]);

const global = `# Global content

Site-wide facts and wording that repeat across https://www.instabizweb.com/. Page-specific copy lives in the individual page files. This file does not describe visual design.

## Company description

From the homepage meta description:

> ${home.description}

From https://www.instabizweb.com/llms.txt:

> Insta Biz Web builds AI-powered websites, mobile apps, CRM systems and digital automation solutions. We help startups and businesses grow through modern design, fast development, and smart digital marketing.

> Founded 2020 in Ahmedabad, India. Insta Biz Web (IBW) is a founder-led digital studio that builds AI-powered websites, mobile apps, CRM/ERP systems, AI agents and growth marketing for 145+ clients across India, the US, the UK, Singapore and the UAE.

Homepage H1: ${home.h1}

## Brand names

- Insta Biz Web
- IBW
- Application name: Insta Biz Web
- Open Graph site name: ${home.og.siteName}
- Twitter site: ${home.twitter.site}
- Twitter creator: ${home.twitter.creator}

## Contact details

Extracted from the contact page and llms.txt.

- Email: info@instabizweb.com
- Phone: +91 98981 24987
- WhatsApp: https://wa.me/919898124987
- Map search used on the site: https://www.google.com/maps/search/?api=1&query=Swanik+Arcade+Naranpura+Ahmedabad+380013
- Headquarters, from llms.txt: 219, Swanik Arcade, Opp. Vardan Tower, Pragati Nagar to KK Nagar Road, Naranpura, Ahmedabad, Gujarat, 380013, India

Contact page H1: ${contact.h1}

## Social links

- Facebook: https://www.facebook.com/profile.php?id=61578562181866
- Instagram: https://www.instagram.com/insta_biz_web/
- X: https://x.com/instabizweb
- LinkedIn: https://www.linkedin.com/company/insta-biz-web/

## Navigation labels

${home.headerMd}

## Footer

${home.footerMd}

## Calls to action that appear on many pages

${repeatedCtas.map(([label, n]) => `- ${label} (on ${n} pages)`).join("\n")}

## About page opening

About meta description: ${about.description}

About H1: ${about.h1}
`;
fs.writeFileSync(path.join(ROOT, "global-content.md"), global, "utf8");

const probed = [
  ["https://www.instabizweb.com/faq", "404", "No standalone FAQ page. FAQs are embedded on service, location, solution, and some other pages."],
  ["https://www.instabizweb.com/faqs", "404", "Not found."],
  ["https://www.instabizweb.com/pricing", "404", "No standalone pricing page. Prices appear inside articles and some service FAQs."],
  ["https://www.instabizweb.com/careers", "404", "No careers page."],
  ["https://www.instabizweb.com/jobs", "404", "Not found."],
  ["https://www.instabizweb.com/team", "301/200", "Redirects to /about-us."],
  ["https://www.instabizweb.com/blog", "301/200", "Redirects to /blogs."],
  ["https://www.instabizweb.com/case-studies", "404", "No case-studies index. Portfolio projects are on /portfolio."],
  ["https://www.instabizweb.com/case-study", "404", "Not found."],
  ["https://www.instabizweb.com/resources", "404", "Not found."],
  ["https://www.instabizweb.com/downloads", "404", "Not found."],
  ["https://www.instabizweb.com/llms.txt", "200", "Extracted to other/llms.md. Not listed in sitemap.xml."],
  ["https://www.instabizweb.com/feed", "404", "Not found."],
  ["https://www.instabizweb.com/rss.xml", "404", "Not found."],
  ["https://www.instabizweb.com/sitemap", "404", "Not found. sitemap.xml exists."],
  ["https://www.instabizweb.com/thank-you", "404", "Not found."],
  ["https://www.instabizweb.com/cookies", "404", "Not found."],
  ["https://www.instabizweb.com/cookie-policy", "404", "Not found."],
  ["https://www.instabizweb.com/sitemap.xml", "200", "URL list only. Not converted into a content page."],
];

let inventory = `# Site inventory

Discovered from sitemap.xml, Firecrawl map, and a full-domain Firecrawl crawl on 24 September 2026. Every sitemap URL returned HTTP 200 and was crawled.

| URL | Page/content type | Page title | Extraction status | Markdown file | Notes |
| --- | --- | --- | --- | --- | --- |
`;
for (const p of pages) {
  inventory += `| ${p.url} | ${p.kind.type} | ${p.title.replace(/\|/g, "\\|")} | Extracted | ${p.rel} | Canonical: ${p.canonical || "none"} |\n`;
}
inventory += `| https://www.instabizweb.com/llms.txt | Machine-readable summary | llms.txt | Extracted | other/llms.md | Public, not in sitemap.xml |\n`;
inventory += `| https://www.instabizweb.com/sitemap.xml | Sitemap |  | Extracted as URL list |  | Used for coverage checks. Not a content page. |\n`;
for (const [url, status, notes] of probed) {
  if (url.endsWith("/llms.txt") || url.endsWith("/sitemap.xml")) continue;
  inventory += `| ${url} | Probe |  | ${status} |  | ${notes} |\n`;
}
inventory += `\n## Coverage check\n\n- Sitemap content URLs: ${contentUrls.length}\n- Markdown page files from those URLs: ${pages.length}\n- Extra public URL: https://www.instabizweb.com/llms.txt\n- Firecrawl crawl documents: 61 (60 pages + sitemap.xml)\n- Hash-only URLs such as /services#web are sections of /services, not separate pages.\n- /team and /blog are redirects, not additional content.\n- No separate portfolio item URLs, blog pagination URLs, careers, pricing, resources, or cookie-policy URLs were found.\n`;
fs.writeFileSync(path.join(ROOT, "site-inventory.md"), inventory, "utf8");

function treeLines(pagesOfType, label) {
  return `### ${label}\n\n${pagesOfType.map((p) => `- ${p.url} → \`${p.rel}\``).join("\n")}\n`;
}
const groups = [
  ["Homepage", (p) => p.kind.type === "Homepage"],
  ["Services", (p) => p.kind.folder === "services"],
  ["Location pages", (p) => p.kind.folder === "locations"],
  ["Solutions / industries", (p) => p.kind.folder === "solutions"],
  ["Portfolio", (p) => p.kind.folder === "portfolio"],
  ["Blog", (p) => p.kind.folder === "blog"],
  ["About", (p) => p.kind.folder === "about"],
  ["Contact", (p) => p.kind.folder === "contact"],
  ["Legal", (p) => p.kind.folder === "legal"],
  ["Other", (p) => p.kind.folder === "other"],
];
let structure = `# Site structure

Public content hierarchy for https://www.instabizweb.com/. Relationships below are navigational and topical. They are not a description of layout.

## Primary navigation

Home, Services, Solutions, About Us, Portfolio, Blogs, Contact.

Services in the header point at anchors on /services: #web, #mobile, #ai, #crm, #marketing, #design. One service has its own URL: /services/ai-agent-development.

Location landing pages are linked from service and marketing content, not as a separate nav item.

## Content hierarchy

`;
for (const [label, pred] of groups) {
  structure += treeLines(pages.filter(pred), label);
}
structure += `
## Relationships

- Each solution page is a child of /solutions.
- Each blog article is a child of /blogs. Articles also cross-link to related posts.
- Ahmedabad location pages overlap the services they promote (web, software, mobile, Odoo, digital marketing, SEO) and link back to /services, /contact-us, and /audit.
- /portfolio describes shipped products. Those products do not have individual public URLs.
- /audit is a lead form for a free website audit, linked from location and service pages.
- Legal pages are linked from the footer: privacy policy, terms and conditions, refund policy.
- /llms.txt summarizes the same public URLs for machines. It is not linked in the visible navigation.
- /team resolves to /about-us. /blog resolves to /blogs.

## Pages that do not exist

FAQ, pricing, careers, jobs, case-studies, resources, downloads, cookie policy, RSS, and thank-you URLs returned 404. FAQ answers and some prices are inside other pages.
`;
fs.writeFileSync(path.join(ROOT, "site-structure.md"), structure, "utf8");

let seo = `# SEO content inventory

Existing metadata only. No recommendations.

| URL | Meta title | Meta description | H1 | Canonical | Robots | OG title | OG description | Twitter title |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
`;
for (const p of pages) {
  const cell = (s) => (s || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  seo += `| ${p.url} | ${cell(p.title)} | ${cell(p.description)} | ${cell(p.h1)} | ${cell(p.canonical)} | ${cell(p.robots)} | ${cell(p.og.title)} | ${cell(p.og.description)} | ${cell(p.twitter.title)} |\n`;
}
seo += `\n## Notes\n\n- No page exposed a meta keywords tag.\n- Googlebot directive, where present, is recorded in each page file under Additional Metadata.\n- Twitter card on crawled pages is summary_large_image when that tag exists.\n- Structured data JSON-LD is included in each page file under Structured Data when the page contains it.\n- Target keywords were not invented. The meta title, H1, and URL slug are the explicit on-page topic signals.\n`;
fs.writeFileSync(path.join(ROOT, "seo-content-inventory.md"), seo, "utf8");

const readme = `# Insta Biz Web content repository

Content extracted from the public site https://www.instabizweb.com/ on 24 September 2026.

Source of discovery:

- robots.txt allows all public pages and disallows /api/ and /_next/. It points to sitemap.xml.
- sitemap.xml lists 60 URLs.
- Firecrawl map returned the same page set.
- Firecrawl crawl completed 61 documents: those 60 pages plus sitemap.xml.
- A follow-up fetch confirmed https://www.instabizweb.com/llms.txt (not in the sitemap).

This repository stores wording, facts, metadata, forms, media references, and links. It does not store or describe the current visual design.

## Files

- \`site-inventory.md\` — every discovered URL, status, and output file
- \`site-structure.md\` — content hierarchy and page relationships
- \`global-content.md\` — company facts, contact details, navigation, footer, repeated calls to action
- \`seo-content-inventory.md\` — existing SEO metadata only
- \`homepage.md\`
- \`services/\` — services index and AI agent development
- \`locations/\` — Ahmedabad service landing pages
- \`solutions/\` — industry CRM and ERP pages
- \`portfolio/\` — single portfolio page (no per-project URLs)
- \`blog/\` — blog index and every article
- \`about/\`, \`contact/\`, \`legal/\`
- \`other/\` — free website audit page and llms.txt

## Not found as standalone pages

Pricing, careers, resources/downloads, cookie policy, RSS, case-study detail pages, and a sitewide FAQ page. Embedded FAQs and prices remain inside the pages where they appear.

## Extraction limits

- Form success and error text is not in the server HTML. Those fields are marked [NOT EXTRACTED].
- /api/ and /_next/ are disallowed and were not crawled.
- Image bytes were not downloaded. Image URLs and alt text were recorded.
`;
fs.writeFileSync(path.join(ROOT, "README.md"), readme, "utf8");

const glued = [];
for (const p of pages) {
  const hits = p.mainMd.match(/[a-z][A-Z]/g) || [];
  if (hits.length) glued.push(`${p.rel}\t${hits.length}`);
}
fs.writeFileSync(".firecrawl/glued-report.txt", glued.join("\n"), "utf8");
console.log("pages", pages.length);
console.log("glued files", glued.length);
console.log(glued.slice(0, 30).join("\n"));
