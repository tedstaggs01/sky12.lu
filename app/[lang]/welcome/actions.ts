"use server";

import { cookies } from "next/headers";
import { isWelcomeCode, welcomeCookie } from "@/lib/welcome-gate";

export async function unlockWelcome(attempt: string) {
  if (!isWelcomeCode(attempt)) return false;

  const jar = await cookies();
  jar.set(welcomeCookie, attempt, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}
