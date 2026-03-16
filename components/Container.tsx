export default function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`max-w-2xl mx-auto px-5 ${className}`}>
      {children}
    </div>
  );
}
