import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    const { loginInput, checkCredentials } = await import("./admin.server");
    const { getAdminSession } = await import("./admin-session.server");
    const parsed = loginInput.parse(data);
    const admin = await checkCredentials(parsed.username, parsed.password);
    if (!admin) return { ok: false as const };
    const session = await getAdminSession();
    await session.update({ adminId: admin.id, username: admin.username });
    return { ok: true as const, username: admin.username };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { getAdminSession } = await import("./admin-session.server");
  const session = await getAdminSession();
  await session.clear();
  return { ok: true as const };
});

export const adminMe = createServerFn({ method: "GET" }).handler(async () => {
  const { currentAdmin } = await import("./admin-session.server");
  return { admin: await currentAdmin() };
});

export const adminStats = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("./admin-session.server");
  await requireAdmin();
  const { dashboardStats } = await import("./admin.server");
  return dashboardStats();
});

export const adminVehicles = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("./admin-session.server");
  await requireAdmin();
  const { listVehiclesAdmin } = await import("./admin.server");
  return listVehiclesAdmin();
});

export const adminPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("./admin-session.server");
  await requireAdmin();
  const { listPostsAdmin } = await import("./admin.server");
  return listPostsAdmin();
});

export const adminOrders = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("./admin-session.server");
  await requireAdmin();
  const { listOrders } = await import("./admin.server");
  return listOrders();
});

export const adminInquiries = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("./admin-session.server");
  await requireAdmin();
  const { listInquiries } = await import("./admin.server");
  return listInquiries();
});

export const adminSubscribers = createServerFn({ method: "GET" }).handler(async () => {
  const { requireAdmin } = await import("./admin-session.server");
  await requireAdmin();
  const { listSubscribers } = await import("./admin.server");
  return listSubscribers();
});

export const adminSaveVehicle = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { vehicleInput, saveVehicle } = await import("./admin.server");
    return saveVehicle(vehicleInput.parse(data));
  });

export const adminSavePost = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const { postInput, savePost } = await import("./admin.server");
    return savePost(postInput.parse(data));
  });

export const adminDelete = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const parsed = z
      .object({
        table: z.enum(["vehicles", "posts", "orders", "inquiries"]),
        id: z.string().uuid(),
      })
      .parse(data);
    const { deleteRow } = await import("./admin.server");
    return deleteRow(parsed.table, parsed.id);
  });

export const adminSetOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const parsed = z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "processing", "paid", "shipped", "completed", "cancelled"]),
      })
      .parse(data);
    const { updateOrderStatus } = await import("./admin.server");
    return updateOrderStatus(parsed.id, parsed.status);
  });

export const adminSetInquiryStatus = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    await requireAdmin();
    const parsed = z
      .object({ id: z.string().uuid(), status: z.enum(["new", "read", "replied", "closed"]) })
      .parse(data);
    const { updateInquiryStatus } = await import("./admin.server");
    return updateInquiryStatus(parsed.id, parsed.status);
  });

export const adminChangePassword = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    const { requireAdmin } = await import("./admin-session.server");
    const admin = await requireAdmin();
    const parsed = z.object({ password: z.string().min(6).max(200) }).parse(data);
    const { changePassword } = await import("./admin.server");
    return changePassword(admin.id, parsed.password);
  });
