# Yumaniq website (clean, deploy-ready)

This is a **content-as-code** site: pages + layout in code, content in JSON + Markdown.

## What to edit
- Main site copy + per-section watermark backgrounds: `content/site.json`
- Blog posts: `content/blog/*.md`
- Watermark behavior: `src/components/SectionBackground.tsx`

## Images
Put background/illustration assets in `public/art/` and reference them from `content/site.json` like:
`/art/hero-atlas.png`

## Run locally
```bash
npm install
npm run dev
```

## Deploy (recommended: Vercel)
1. Push this repo to GitHub
2. In Vercel: **New Project** → import repo → Deploy
3. Add your domain in Vercel → update DNS per Vercel instructions

## Notes
- No Framer, no CMS lock-in; everything is version-controlled.
- The default visual system is: base dark + faint watermark + wash overlay for readability.
