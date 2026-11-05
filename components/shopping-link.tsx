import { stay } from "@/lib/stay-details";

export function ShoppingLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={stay.shoppingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-foreground underline"
    >
      {children}
    </a>
  );
}
