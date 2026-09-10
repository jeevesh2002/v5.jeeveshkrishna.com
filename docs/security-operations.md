# Security operations

The site runs on Node.js 24. Deploy the reviewed dependency lockfile and source together. Do not apply older open Dependabot PRs over newer patched versions.

## Request protection

Mutation APIs validate exact origins, content type, body shape and streamed byte size. Admin and cron secrets are compared with constant-time digests. Comments must target published posts; preview and stored HTML share a sanitizer. Public comment reads are capped at 500 entries. The CSP retains inline scripts for static Next.js hydration; it is not a nonce-based CSP. Framing, object embedding, MIME sniffing and base-tag injection are restricted.

The database-backed rate limiter serializes each admission in a short transaction, prunes expired counters and charges global quota only when client admission succeeds. The runtime database role currently needs CREATE/ALTER privileges for existing lazy schema setup. A future migration-based deployment can pre-create tables and reduce that role's privileges. Vercel forwarding headers supply IP identity; other hosting environments share the conservative unknown-client bucket until a trusted proxy is configured. Distributed malicious clients can still consume finite site-wide quotas; edge filtering is complementary.

## Subscription consent and token privacy

New addresses first enter `newsletter_pending`, with a single-use token that expires after 24 hours. Repeated pending requests do not send more confirmation email within that period. Only the explicit confirmation POST inserts into `newsletter_subscribers`. Existing subscribers are preserved; this change does not retroactively verify their historical consent. Failed confirmation delivery leaves the pending record until expiry to prevent retry spam.

GET unsubscribe links only open a confirmation page. User confirmation and mail-provider RFC 8058 one-click requests use POST. All token responses and UI pages use no-store/no-referrer and omit analytics. Do not add client-side navigation or third-party scripts to token pages without retesting privacy. Never log token URLs, recipient addresses, admin keys, or provider error objects.

## Newsletter delivery failures

`newsletter_sent` retains all old send records. Schema setup adds `status` (historical rows default to `sent`) and `failed_count`. New sends atomically claim the slug as `sending` before any provider call. Both manual requests and cron use that claim. Provider idempotency keys add a 24-hour duplicate guard. `recipient_count` counts provider acknowledgements, not inbox delivery.

A row left `sending`, or marked `needs_review`, requires reconciliation against provider receipts and database state. Do not delete/reset the row or automatically retry the post: an interrupted call might already have delivered email. Keep the current cron schedule; this security change does not publish posts or manually send newsletters.

## Verification and rollback

Before merging, require the security regression tests, lint, typecheck, production build, dependency audit, CodeGuard/Semgrep and redacted secret scan. Check the Vercel preview and final production commit. Local tests use synthetic data and isolated PostgreSQL; they do not prove production database permissions, environment variables or email deliverability.

If production fails, retain the additive tables and send claims while investigating. A code rollback must not replay claimed newsletters or reactivate unconfirmed pending addresses. Avoid reverting the patched framework to a vulnerable version; use a forward fix or temporarily fail closed for the affected API.
