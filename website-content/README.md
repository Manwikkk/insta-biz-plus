# Insta Biz Web content repository

Content extracted from the public site https://www.instabizweb.com/ on 24 September 2026.

Source of discovery:

- robots.txt allows all public pages and disallows /api/ and /_next/. It points to sitemap.xml.
- sitemap.xml lists 60 URLs.
- Firecrawl map returned the same page set.
- Firecrawl crawl completed 61 documents: those 60 pages plus sitemap.xml.
- A follow-up fetch confirmed https://www.instabizweb.com/llms.txt (not in the sitemap).

This repository stores wording, facts, metadata, forms, media references, and links. It does not store or describe the current visual design.

## Changes made for the site since the crawl

Digital Marketing and UI/UX Design are no longer offered, and Business Automation joins as service 01 (client brief, 25 September 2026). Business Automation has no page on the live site; its copy lives in `src/content/services.ts`.

- Removed: `locations/digital-marketing-agency-in-ahmedabad.md`, `locations/seo-company-in-ahmedabad.md`, `other/free-website-audit.md` and the posts `seo-fundamentals-for-founders-2026-edition`, `aeo-geo-how-to-rank-in-google-ai-overviews-and-chatgpt`, `aso-app-store-optimization-2026` and `designing-mobile-apps-people-actually-keep`. Their URLs redirect (`next.config.ts`).
- Edited: the organisation description on every page, the services, about and refund-policy titles and descriptions (here and in `seo-content-inventory.md`), the services catalog, two Web Development FAQs, the refund policy and terms, the blog and portfolio listings, links to the removed posts, and `other/llms.md`.
- `global-content.md`, `site-structure.md` and `site-inventory.md` still describe the site as crawled.

## Files

- `site-inventory.md` — every discovered URL, status, and output file
- `site-structure.md` — content hierarchy and page relationships
- `global-content.md` — company facts, contact details, navigation, footer, repeated calls to action
- `seo-content-inventory.md` — existing SEO metadata only
- `homepage.md`
- `services/` — services index and AI agent development
- `locations/` — Ahmedabad service landing pages
- `solutions/` — industry CRM and ERP pages
- `portfolio/` — single portfolio page (no per-project URLs)
- `blog/` — blog index and every article
- `about/`, `contact/`, `legal/`
- `other/` — free website audit page and llms.txt

## Not found as standalone pages

Pricing, careers, resources/downloads, cookie policy, RSS, case-study detail pages, and a sitewide FAQ page. Embedded FAQs and prices remain inside the pages where they appear.

## Extraction limits

- Form success and error text is not in the server HTML. Those fields are marked [NOT EXTRACTED].
- /api/ and /_next/ are disallowed and were not crawled.
- Image bytes were not downloaded. Image URLs and alt text were recorded.
