import { cookies } from "next/headers";

const COOKIE_NAME = "zima_session";
const SECRET = process.env.AUTH_SECRET ?? "zima-dev-secret-change-in-production";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "hr";
}

function sign(payload: string): string {
  const { createHmac } = require("crypto");
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function encodeSession(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(value: string): SessionUser | null {
  const dot = value.indexOf(".");
  if (dot === -1) return null;
  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (sign(payload) !== sig) return null;
  try {
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const u = JSON.parse(json) as SessionUser;
    if (!u.id || !u.email || !u.name || !u.role) return null;
    return u;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return null;
  return decodeSession(value);
}

export async function setSession(user: SessionUser): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, encodeSession(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
