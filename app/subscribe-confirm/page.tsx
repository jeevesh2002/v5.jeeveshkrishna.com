import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm subscription",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ConfirmSubscription({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; status?: string }>;
}) {
  const { token, status } = await searchParams;
  const valid =
    typeof token === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);
  return (
    <section style={{ maxWidth: "40rem", margin: "4rem auto", padding: "1.5rem" }}>
      <h1>{status === "success" ? "You are subscribed." : "Confirm your subscription"}</h1>
      {valid ? (
        <>
          <p>Receive an email when I publish a new post.</p>
          <form action={`/api/subscribe/confirm?token=${encodeURIComponent(token)}`} method="post">
            <button type="submit">Confirm subscription</button>
          </form>
        </>
      ) : (
        <p>
          {status === "success"
            ? "Thanks for reading. You can unsubscribe from any email."
            : status === "error"
              ? "We could not complete this request. Please try again later."
              : "This link is invalid, expired, or already used. You can request a new subscription from the blog."}
        </p>
      )}
    </section>
  );
}
