# jeeveshkrishna.com

Personal website for Jeevesh Krishna Arigala. Not a job portfolio -- a personal introduction to the world.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with CSS custom properties for theming
- **Fonts:** Inter (body) + Lora (headings/serif accent) via `next/font`
- **Database:** Vercel Postgres (for blog comments)
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel

## Project Structure

```text
jeeveshkrishna.com/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout: Nav, Footer, theme script, analytics
│   ├── page.tsx                # Home page
│   ├── about/page.tsx          # About page
│   ├── experience/page.tsx     # Work experience + education + skills
│   ├── projects/page.tsx       # Personal and academic projects
│   ├── work/page.tsx           # Professional work history
│   ├── blog/
│   │   ├── page.tsx            # Blog post listing
│   │   ├── BlogContent.tsx     # Client component for blog list UI
│   │   └── [slug]/page.tsx     # Individual post page (SSG)
│   ├── reading/
│   │   ├── page.tsx            # Reading list page
│   │   └── ReadingContent.tsx  # Client component for reading list UI
│   ├── interests/page.tsx      # Curated links and interests
│   ├── resume/page.tsx         # Resume viewer (embeds public/resume.pdf)
│   ├── api/
│   │   └── comments/[slug]/route.ts  # Comments REST API (GET/POST/DELETE)
│   ├── robots.ts               # robots.txt generation
│   └── sitemap.ts              # sitemap.xml generation
│
├── components/
│   ├── Nav.tsx                 # Top navigation bar with dark/light theme toggle
│   ├── Footer.tsx              # Site footer
│   ├── Container.tsx           # Shared max-width layout wrapper
│   └── Comments.tsx            # Client component: comment form + display
│
├── lib/
│   ├── posts.ts                # Blog post helpers: read markdown, parse frontmatter, render HTML
│   ├── data.ts                 # All static site content (experience, education, projects, etc.)
│   └── utils.ts                # Shared utilities (e.g. formatDate)
│
├── posts/                      # Blog posts as Markdown files
│   └── *.md                    # Frontmatter: title, date, tags, excerpt, published
│
└── public/
    └── resume.pdf              # Resume served statically
```

## Key Patterns

### Static Content in `lib/data.ts`

All structured site content (experience, education, skills, projects, awards, certifications, interests) lives in `lib/data.ts` as typed exports. Pages import directly from this file -- no CMS.

### Blog Posts as Markdown

Posts live in `posts/*.md` with gray-matter frontmatter. `lib/posts.ts` reads them at build time, converts Markdown to HTML via remark, and estimates reading time. Individual post pages are statically generated via `generateStaticParams`.

### Theming

Dark/light mode is handled with a `data-theme` attribute on `<html>`. A synchronous inline script injected before paint (in `layout.tsx`) reads `localStorage` to prevent flash of wrong theme. CSS custom properties (`--text-1`, `--bg-1`, `--border`, etc.) are defined in `globals.css` per theme.

### Comments API

`app/api/comments/[slug]/route.ts` is a Next.js Route Handler backed by Vercel Postgres. It self-bootstraps the `comments` table on first request. Security features: origin check, rate limiting (3 posts/IP/10min), honeypot field, input sanitization, and timing-safe admin key comparison.

### Admin Comments

When posting a comment with a valid `ADMIN_KEY` in the request body, the comment is stored with `is_owner = true` and rendered with a visual distinction in the UI.

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `POSTGRES_URL` | Optional | Vercel Postgres connection string. Comments are silently disabled if absent. |
| `ADMIN_KEY` | Optional | Secret key for posting owner-flagged comments and deleting any comment. |

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run lint
```

## Adding a Blog Post

Create `posts/your-slug.md` with the following frontmatter:

```markdown
---
title: Your Post Title
date: "2026-01-01"
tags: ["tag1", "tag2"]
excerpt: A short summary shown on the listing page and in metadata.
published: true
---

Post content in Markdown...
```

Set `published: false` to keep a post hidden from the listing without deleting the file.
