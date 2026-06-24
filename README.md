# PixDetector.com — Complete Setup Guide

## What's Included

```
pixdetector/
├── index.html              ← Homepage (all tools listed)
├── css/style.css           ← All styles
├── js/main.js              ← Homepage JS
├── js/tool.js              ← Shared tool logic (AI API calls)
├── tools/
│   ├── ai-generated-image-checker.html   ← #1 tool (most traffic)
│   ├── ai-deepfake-checker.html
│   ├── ai-fake-image-checker.html
│   ├── ai-image-authenticity-checker.html
│   ├── ai-image-analyzer.html
│   ├── ai-image-quality-checker.html
│   ├── ai-image-seo-checker.html
│   ├── ai-image-content-checker.html
│   ├── ai-image-moderation-tool.html
│   └── ... (more tools)
├── about.html
├── privacy.html
├── terms.html
├── sitemap.xml             ← Submit to Google Search Console
├── robots.txt
└── vercel.json             ← Vercel deployment config
```

---

## Step 1 — Get Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up / Log in
3. Go to "API Keys" → Create new key
4. Copy the key (starts with `sk-ant-...`)

---

## Step 2 — Add API Key to Code

Open `js/tool.js` and find this line:

```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
```

Add your API key header:

```javascript
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'YOUR_API_KEY_HERE',
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true'
},
```

⚠️ IMPORTANT: For production, use a backend proxy instead of exposing key in frontend.

---

## Step 3 — Deploy to Vercel (FREE)

### Option A: Drag & Drop (Easiest)
1. Go to https://vercel.com → Sign up free
2. Click "Add New Project"
3. Click "Browse" and select your `pixdetector` folder
4. Click Deploy → Done! ✅

### Option B: GitHub (Recommended for updates)
1. Create GitHub account at https://github.com
2. Create new repository named "pixdetector"
3. Upload all files to the repository
4. Go to https://vercel.com → "Add New Project"
5. Connect GitHub → Select "pixdetector" repo
6. Deploy → Done! ✅

---

## Step 4 — Add Custom Domain

1. Buy `pixdetector.com` on Namecheap (~$10/year)
2. In Vercel dashboard → Your project → Settings → Domains
3. Add `pixdetector.com`
4. Copy the DNS records Vercel shows you
5. In Namecheap → DNS settings → Add those records
6. Wait 24-48 hours → Your site is live! 🚀

---

## Step 5 — SEO Setup

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add property → Enter `pixdetector.com`
3. Verify ownership (HTML file method)
4. Submit sitemap: `https://pixdetector.com/sitemap.xml`

### Google Analytics (Optional but recommended)
1. Go to https://analytics.google.com
2. Create account → Add property
3. Copy tracking code
4. Add to `<head>` of `index.html`

---

## Step 6 — Monetization

### Google AdSense
1. Apply at https://adsense.google.com
2. Add your site
3. Wait for approval (1-2 weeks)
4. Add ad code to your pages
5. Earn from every visitor!

### Best Ad Placements for Tool Sites:
- Above the upload zone
- Below the results
- Sidebar on desktop
- Between tool cards on homepage

---

## Adding More Tools

Copy any existing tool HTML file in `/tools/` folder.
Change:
- `<title>` tag
- `<h1>` content  
- `window.TOOL_PROMPT` (the AI instructions)
- About section content
- FAQ content
- Related tools links

---

## Cost Breakdown

| Item | Cost |
|------|------|
| Vercel Hosting | FREE |
| Domain (.com) | ~$10/year |
| Anthropic API | Pay per use (~$0.003/image) |
| Total to launch | ~$10 |

API costs: With 1000 users/day analyzing images = ~$3/day API cost.
Once you have traffic, AdSense revenue will easily cover this.

---

## Questions?
Built with ❤️ by PixDetector
