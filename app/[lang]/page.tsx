import { notFound, redirect } from "next/navigation";
import { hasLocale } from "@/lib/locale";

export const instant = false;

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  redirect(`/${lang}/welcome`);
}
