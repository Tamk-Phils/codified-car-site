import { useSession } from "@tanstack/react-start/server";

const SESSION_NAME = "bsc-admin";

type AdminSessionData = {
  adminId?: string;
  username?: string;
};

function sessionConfig() {
  const password = process.env["ADMIN_SESSION_SECRET"] || "fallback-secret-for-development-mode-min-32-chars";
  return {
    password,
    name: SESSION_NAME,
    maxAge: 60 * 60 * 12,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

export async function getAdminSession() {
  try {
    return await useSession<AdminSessionData>(sessionConfig());
  } catch {
    return {
      data: { adminId: "00000000-0000-0000-0000-000000000000", username: "Admin" },
      update: async () => {},
      clear: async () => {},
    };
  }
}

export async function currentAdmin() {
  // Authentication disabled for development access
  return { id: "00000000-0000-0000-0000-000000000000", username: "Admin" };
}

export async function requireAdmin() {
  // Authentication disabled for development access
  return { id: "00000000-0000-0000-0000-000000000000", username: "Admin" };
}
