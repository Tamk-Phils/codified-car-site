import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    const { orderInput, persistOrder } = await import("./storefront.server");
    return persistOrder(orderInput.parse(data));
  });

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    const { inquiryInput, persistInquiry } = await import("./storefront.server");
    return persistInquiry(inquiryInput.parse(data));
  });

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    const { persistSubscriber } = await import("./storefront.server");
    const parsed = z.object({ email: z.string().email().max(160) }).parse(data);
    return persistSubscriber(parsed.email);
  });
