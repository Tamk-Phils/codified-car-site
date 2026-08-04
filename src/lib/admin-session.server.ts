import { useSession } from "@tanstack/react-start/server";

const SESSION_NAME = "bsc-admin";

type AdminSessionData = {
  adminId?: string;
  username?: string;
};

function sessionConfig() {
  const password = process.env["ADMIN_SESSION_SECRET"];
  if (!password) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return {
    password,
    name: SESSION_NAME,
    maxAge: 60 * 60 * 12,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

export async function getAdminSession() {
  return useSession<AdminSessionData>(sessionConfig());
}

export async function currentAdmin() {
  const session = await getAdminSession();
  if (!session.data.adminId || !session.data.username) return null;
  return { id: session.data.adminId, username: session.data.username };
}

export async function requireAdmin() {
  const admin = await currentAdmin();
  if (!admin) throw new Error("Unauthorized: admin sign-in required");
  return admin;
}
