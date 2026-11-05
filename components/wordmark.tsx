export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-tight ${className}`}>
      Sky<span className="text-[#1d6a8a]">12</span>
    </span>
  );
}
