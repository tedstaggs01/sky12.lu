import { cookies } from "next/headers";

export const welcomeCookie = "sky12_welcome";
const welcomeToken = "stay";

export async function welcomeUnlocked() {
  const jar = await cookies();
  return jar.get(welcomeCookie)?.value === welcomeToken;
}
