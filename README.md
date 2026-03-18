# jeeveshkrishna.com

Personal website for Jeevesh Krishna Arigala. Not a job portfolio -- a personal introduction to the world.

## Tech Stack

- **Framework:** Next.js (App Router) with React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + CSS custom properties for theming
- **Fonts:** Inter (body) + Lora (headings) via `next/font`
- **Database:** Neon (serverless Postgres) -- comments, newsletter subscribers, send history
- **Email:** Resend -- welcome emails and post notification newsletters
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel

## Project Structure

```text
jeeveshkrishna.com/
├── app/
│   ├── layout.tsx                        # Root layout: Nav, Footer, theme script, analytics
│   ├── page.tsx                          # Home
│   ├── about/page.tsx
│   ├── blog/
│   │   ├── page.tsx                      # Post listing
│   │   └── [slug]/page.tsx              # Individual post (SSG)
│   ├── experience/page.tsx
│   ├── projects/page.tsx
│   ├── reading/page.tsx
│   ├── interests/page.tsx
│   ├── resume/page.tsx                  # Embeds public/resume.pdf
│   ├── bugs/page.tsx                    # Feedback/contact form
│   ├── graveyard/page.tsx               # Discontinued projects
│   ├── colophon/page.tsx
│   ├── unsubscribe/page.tsx
│   ├── api/
│   │   ├── comments/[slug]/route.ts     # GET / POST / DELETE comments
│   │   ├── subscribe/route.ts           # GET (confirm) / POST (subscribe)
│   │   ├── newsletter/
│   │   │   ├── send/route.ts            # POST -- manual newsletter send (admin)
│   │   │   └── auto-send/route.ts       # GET -- cron-triggered newsletter send
│   │   └── unsubscribe/route.ts         # GET -- token-based unsubscribe
│   ├── feed.xml/route.ts                # RSS feed
│   ├── robots.ts
│   └── sitemap.ts
│
├── components/
│   ├── Nav.tsx
│   ├── Footer.tsx
│   ├── Container.tsx
│   ├── Comments.tsx                     # Comment form + list (markdown editor, live preview)
│   ├── NewsletterSignup.tsx
│   └── ShareButtons.tsx
│
├── lib/
│   ├── posts.ts                         # Read markdown, parse frontmatter, render HTML, reading time
│   ├── data.ts                          # All static content (experience, projects, interests, etc.)
│   ├── email.ts                         # Email template builders (HTML + plain text)
│   └── utils.ts                         # formatDate and other helpers
│
├── posts/                               # Blog posts as Markdown files
│   └── *.md                             # Frontmatter: title, date, tags, excerpt, published
│
└── public/
    └── resume.pdf
```

## Data Flow

**Blog post read:**
Browser -> `/blog/[slug]` -> `getPostBySlug()` reads `/posts/{slug}.md` -> gray-matter parses frontmatter -> remark converts to HTML -> page renders -> comments loaded via `GET /api/comments/[slug]`

**Comment posted:**
Form submit -> `POST /api/comments/[slug]` -> markdown sanitized with sanitize-html -> inserted into `comments` table -> returned to client

**Newsletter:**
Daily Vercel cron hits `GET /api/newsletter/auto-send` at 19:00 UTC -> finds posts not yet in `newsletter_sent` table -> batches emails via Resend -> marks posts sent

**Subscribe:**
Form submit -> `POST /api/subscribe` -> MX record + email validation -> inserted into `newsletter_subscribers` -> welcome email sent via Resend

## Key Patterns

**Static content in `lib/data.ts`:** All structured site content (experience, education, skills, projects, interests) lives here as typed exports. No CMS.

**Blog posts as Markdown:** Posts in `posts/*.md` with gray-matter frontmatter. `lib/posts.ts` reads them at build time. Individual post pages are statically generated via `generateStaticParams`.

**Theming:** Dark/light mode via `data-theme` on `<html>`. A synchronous inline script in `layout.tsx` reads `localStorage` before paint to prevent flash. CSS custom properties (`--text-1`, `--bg`, `--border`, etc.) defined per theme in `globals.css`.

**Admin auth:** `ADMIN_KEY` env var. Compared with timing-safe SHA256 hash. Used for posting owner-flagged comments and deleting any comment.

**Rate limiting:** In-memory per serverless instance. Subscribe: 5/min/IP. Comment post: 3/10min/IP. Bot protection: honeypot fields.

## Environment Variables

| Variable                | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| `v5sitedb_DATABASE_URL` | Neon Postgres connection string (set by Vercel integration) |
| `ADMIN_KEY`             | Secret for owner comments and comment deletion              |
| `RESEND_API_KEY`        | Resend API key for sending emails                           |
| `CRON_SECRET`           | Vercel cron authentication (set automatically by Vercel)    |

Optional rate limit overrides: `COMMENTS_POST_LIMIT`, `COMMENTS_POST_WINDOW`, `COMMENTS_DELETE_LIMIT`, `COMMENTS_DELETE_WINDOW`

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run lint
npm run typecheck
```

## Adding a Blog Post

Create `posts/your-slug.md`:

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

Set `published: false` to hide a post without deleting it. The newsletter cron will only send posts where `published: true` and the slug is not yet in the `newsletter_sent` table.
