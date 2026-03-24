import NewsletterPopup from "@/components/NewsletterPopup";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NewsletterPopup />
    </>
  );
}
