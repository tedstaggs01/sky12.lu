"use server";

import { cookies } from "next/headers";
import { welcomeCookie } from "@/lib/welcome-gate";

const code = "7378";

export async function unlockWelcome(attempt: string) {
  if (attempt !== code) return false;

  const jar = await cookies();
  jar.set(welcomeCookie, "stay", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}
