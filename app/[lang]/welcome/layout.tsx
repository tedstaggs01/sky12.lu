import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { WelcomeLock } from "@/components/welcome-lock";
import { Wordmark } from "@/components/wordmark";
import { hasLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";
import { welcomeUnlocked } from "@/lib/welcome-gate";

export const instant = false;

export default async function WelcomeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getMessages(lang);
  const open = await welcomeUnlocked();

  return (
    <div className="flex flex-1 flex-col bg-white text-foreground">
      <header>
        <div className="mx-auto flex max-w-xl justify-center px-6 pt-12 pb-1">
          <p className="text-[34px] leading-none">
            <Wordmark />
          </p>
        </div>
      </header>
      {open ? (
        children
      ) : (
        <WelcomeLock
          labels={{
            title: t.welcome.codeTitle,
            hint: t.welcome.codeHint,
            wrong: t.welcome.codeWrong,
          }}
        />
      )}
      <div className="print:hidden">
        <SiteFooter locale={lang} narrow />
      </div>
    </div>
  );
}
