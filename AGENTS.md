# AGENTS.md — PixDetector

Instructions for any AI agent (or human) making changes to this repo. This is a static HTML/CSS/JS site deployed on Vercel. SEO is a primary goal — follow these rules on every change.

## Canonical domain

**The single source of truth for the live domain is `https://pixdetector.vercel.app`.**

If a custom domain (e.g. `pixdetector.com`) is purchased and properly connected in Vercel with DNS verified, update this file first, then run a repo-wide find/replace across every canonical tag, `sitemap.xml`, `robots.txt`, and `og:url` tag. Never let the domain drift out of sync between these files — that alone caused a full sitemap outage previously.

## URL conventions (cleanUrls)

`vercel.json` has `"cleanUrls": true`. This means:
- Live URLs never include `.html` (e.g. `/tools/ai-image-analyzer`, not `/tools/ai-image-analyzer.html`)
- Every `<link rel="canonical">` and every `sitemap.xml` `<loc>` must use the extensionless form
- Internal `<a href>` links may point to the `.html` file (Vercel redirects), but prefer extensionless for a cleaner crawl path when adding new links

## Adding a new page checklist

Every new `.html` page (especially new `/tools/*.html` pages) MUST have, before merging:
1. Unique `<title>` including the target keyword
2. Unique `<meta name="description">` (under ~160 chars)
3. `<link rel="canonical" href="https://pixdetector.vercel.app/...">` (extensionless, no trailing `.html`)
4. `<meta property="og:url" content="...">` matching the canonical
5. An entry added to `sitemap.xml` with a `<loc>` that matches the canonical exactly
6. At least one internal link to it from another live, indexed page (no orphan pages)
7. Real, unique body content (150+ words) — not just a UI shell. Thin/duplicate-template pages hurt the whole site's rankings.

## Removing a page

If a page is deleted or renamed:
1. Remove its `<url>` entry from `sitemap.xml` immediately — a sitemap listing a dead URL is a validation error in Search Console
2. Update any internal links pointing to it
3. Consider adding a redirect in `vercel.json` if the URL had earned any backlinks/rankings

## Before every deploy

Run these checks locally or in CI before pushing:
- [ ] No `<script src="...">` or `<link href="...">` reference points to a file that doesn't exist in the repo (this caused a live 404 + blocked-script bug — check `js/` and `css/` references against actual files)
- [ ] `python3 -m json.tool vercel.json` succeeds (valid JSON)
- [ ] `grep -rn "pixdetector\.com"` across `*.html *.xml *.txt` returns nothing except intentional contact email addresses — if it finds a URL, that's the domain bug recurring
- [ ] Every file in `sitemap.xml` corresponds to a real file in the repo (`ls tools/*.html` vs sitemap entries)
- [ ] Every `.html` file in `tools/` has a canonical tag pointing to the correct domain

## SEO priorities (in order)

1. **Don't break what's indexed.** Domain/canonical/sitemap consistency > everything else. A broken sitemap or wrong canonical can silently tank the whole site's crawl budget.
2. **No broken functionality.** A tool page whose JS 404s or errors kills engagement metrics, which Google uses as a ranking signal. Treat console errors on any page as a launch blocker.
3. **Real content over quantity.** 24 near-duplicate "AI image checker" pages competing with each other is worse than 10 well-differentiated pages with unique content and internal links.
4. **Backlinks and directory listings** are the main lever once on-page/technical issues are fixed — track this separately from code changes.

## History / known issues log

- 2026-07-01: Fixed sitemap/robots.txt/all canonical tags pointing to unconfigured `pixdetector.com` instead of live `pixdetector.vercel.app`. Removed sitemap entry for non-existent `ai-image-detection-tool.html`. Enabled `cleanUrls` in `vercel.json`, replacing a no-op legacy `routes` block. Added missing canonical tags to `about.html`, `privacy.html`, `terms.html`.
- 2026-07-01: Found `js/api-config.js` referenced on every page but not present in repo, causing a 404 + blocked script (strict MIME type checking). Removed the dead references — nothing else depended on that file.
- 2026-07-01: **Critical:** found the live Groq API key hardcoded in plaintext in `js/tool.js`, calling the Groq API directly from the browser — fully exposed to anyone viewing page source. Rewired `tool.js` to call the existing `/api/analyze` serverless function instead, which reads `GROQ_API_KEY` from a server-side environment variable. **Requires `GROQ_API_KEY` to be set in Vercel Project Settings → Environment Variables for this to work.** The old exposed key must be rotated in the Groq console — it was leaked publicly and should be treated as compromised regardless of this fix.
- 2026-08-09: GSC data (28 days) showed the `.html`/clean-URL duplicate pair impressions are just residual pre-July-1 crawl data — canonical/cleanUrls fix from 2026-07-01 is confirmed working (Indexing report: 16 pages correctly flagged "Alternate page with proper canonical tag"). Real active issue found instead: GSC flagged 8 tool pages as "Discovered - currently not indexed" — traced to `ai-image-analysis-tool`, `ai-image-assessment-tool`, `ai-image-evaluation-tool`, `ai-image-review-tool` returning a functionally identical AI output schema to `ai-image-analyzer` (same generic ai_probability/verdict JSON, just synonym titles/copy). Fixed by genuinely differentiating each tool's `TOOL_PROMPT` output shape (technical-quality data / numeric scoring rubric / per-context suitability / editorial feedback respectively) plus matching About-text and a short unique FAQ per page. Also fixed a hardcoded `pixdetector.com` canonical in `generate_tools.py` (line 134) that would have silently reverted canonicals if the generator were re-run — it only covers 8 of the 24 live tool pages and is stale, worth regenerating or retiring in a future pass. Also removed leftover "PixDetector.com" text from the footer copyright line across all 28 pages (contact emails @pixdetector.com left as-is). Title/meta-description rewrites were deliberately deferred: at current avg. position 60-90, CTR is near-zero regardless of title quality — that lever only pays off once position improves into the top 30-40.
- 2026-09-18: 3-month GSC data confirmed the 2026-08-09 differentiation fix is working — `ai-image-evaluation-tool` and `ai-image-analysis-tool` now pull real impressions/clicks with noticeably better position than the pack. Found homepage "🔥 Most Popular / Trending / Popular" badges were factually wrong: `ai-generated-image-checker` and `ai-deepfake-checker` (badged as top tools) had near-zero real search impressions (8 and unmeasurable respectively), while `ai-image-analyzer` (2111 impr), `ai-image-analysis-tool` (1206 impr) and `ai-image-resolution-checker` (811 impr) — unbadged — were the real top performers. Moved the badges and the hero CTA button to match actual data. Also rewrote title/meta description on 6 pages sitting at a genuinely reachable position (60-76) with real impression volume but 0 clicks — `ai-image-resolution-checker`, `ai-image-quality-checker`, `ai-image-quality-analyzer`, `ai-image-seo-analyzer`, `ai-image-originality-checker`, `ai-image-compliance-checker` — since at this position range, unlike the rest of the site (avg position ~76-84), better copy has a real chance of converting impressions to clicks. Left the other ~20 pages' titles alone — they're still at position 75-95 where CTR is near-zero regardless of title quality.
- 2026-09-18 (later same day): Content-depth audit found most tool pages were genuinely thin — 200-300 visible words, and of that, mostly UI chrome (button labels, 2-5 word use-case card titles) rather than real prose; `ai-image-analyzer`'s actual paragraph content was ~105 words. Expanded the 4 highest real-demand pages (per GSC: `ai-image-analyzer` 2111 impr, `ai-image-analysis-tool` 1206 impr, plus the verification cluster `ai-image-verification-tool` and `ai-image-authenticity-checker`) from ~200-300 words to 500-680 words each with genuinely differentiated substance per page: a "How It Works" section explaining the actual technical signals in plain language, a "What the Results Mean" section tied to each page's specific JSON output fields, an honest "Limitations" section, and a real multi-sentence FAQ (not 1-liners) that explicitly cross-links to and differentiates from sibling pages (verification-tool vs authenticity-checker; analyzer vs analysis-tool). Remaining ~20 tool pages are still at the thin 200-300 word baseline — worth the same treatment next, prioritized by GSC demand.

## Secrets policy

Never hardcode API keys, tokens, or secrets in any file under `js/`, `css/`, or any `.html` file — these are served directly to the browser. Secrets belong only in Vercel environment variables, read server-side inside `api/*.js` serverless functions. If a tool needs to call a third-party API, it must go through a serverless function proxy, never call the third-party API directly from client-side JS.
