import { cookies } from "next/headers";

export const welcomeCookie = "sky12_welcome";
export const welcomeCodes = ["6708", "8062", "3356"] as const;

export type WelcomeCode = (typeof welcomeCodes)[number];

export function isWelcomeCode(value: string): value is WelcomeCode {
  return welcomeCodes.some((code) => code === value);
}

export async function welcomeCode() {
  const jar = await cookies();
  const value = jar.get(welcomeCookie)?.value ?? "";
  return isWelcomeCode(value) ? value : null;
}

export async function welcomeUnlocked() {
  return (await welcomeCode()) !== null;
}
