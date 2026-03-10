import { NextRequest } from "next/server";
import { getRepository } from "@/lib/repositories";
import { jsonError, jsonOk } from "@/lib/api-utils";
import { setSession } from "@/lib/auth/session";

const ADMIN_EMAIL = "admin";
const ADMIN_PASSWORD = "zdznn1003!";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };
    if (!email || typeof password !== "string") {
      return jsonError("Email and password required", 400);
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      await setSession({
        id: "admin",
        email: ADMIN_EMAIL,
        name: "Admin",
        role: "admin",
      });
      return jsonOk({ id: "admin", email: ADMIN_EMAIL, name: "Admin", role: "admin" });
    }

    const repo = getRepository();
    const hr = await repo.hr.getByEmail(trimmedEmail);
    if (!hr) {
      return jsonError("Invalid email or password", 401);
    }
    const expectedPassword = hr.password ?? "";
    if (expectedPassword !== password) {
      return jsonError("Invalid email or password", 401);
    }

    await setSession({
      id: hr.id,
      email: hr.email,
      name: hr.name,
      role: hr.role,
    });
    return jsonOk({ id: hr.id, email: hr.email, name: hr.name, role: hr.role });
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return jsonError("Login failed", 500);
  }
}
