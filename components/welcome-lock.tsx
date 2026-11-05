"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { unlockWelcome } from "@/app/[lang]/welcome/actions";

export function WelcomeLock({
  labels,
}: {
  labels: { title: string; hint: string; wrong: string };
}) {
  const router = useRouter();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [wrong, setWrong] = useState(false);
  const [pending, setPending] = useState(false);

  async function submit(code: string) {
    setPending(true);
    const ok = await unlockWelcome(code);
    if (ok) {
      router.refresh();
      return;
    }
    setPending(false);
    setWrong(true);
    setDigits(["", "", "", ""]);
    inputs.current[0]?.focus();
  }

  function write(index: number, value: string) {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    const chars = clean.slice(0, 4 - index).split("");
    const next = [...digits];
    chars.forEach((char, offset) => {
      next[index + offset] = char;
    });
    setDigits(next);
    setWrong(false);

    const focusAt = Math.min(index + chars.length, 3);
    inputs.current[focusAt]?.focus();
    if (next.every(Boolean)) void submit(next.join(""));
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col items-center justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{labels.title}</h1>
      <p className="mt-3 text-center text-[15px] text-muted">{labels.hint}</p>
      <div className="mt-8 flex gap-3" role="group" aria-label={labels.title}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(node) => {
              inputs.current[index] = node;
            }}
            value={digit}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            autoFocus={index === 0}
            aria-invalid={wrong}
            disabled={pending}
            maxLength={index === 0 ? 4 : 1}
            onChange={(event) => write(index, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !digits[index] && index > 0) {
                inputs.current[index - 1]?.focus();
              }
            }}
            onFocus={(event) => event.target.select()}
            className={`h-16 w-14 rounded-2xl border bg-white text-center text-2xl font-medium outline-none transition-colors focus:border-[#1d6a8a] disabled:opacity-60 ${
              wrong ? "border-red-400" : "border-line"
            }`}
          />
        ))}
      </div>
      <p className="mt-4 h-5 text-sm text-red-600" role="status">
        {wrong ? labels.wrong : ""}
      </p>
    </div>
  );
}
