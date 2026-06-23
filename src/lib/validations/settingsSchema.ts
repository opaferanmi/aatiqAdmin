import { z } from "zod";

export const settingsSchema = z.object({
  businessName: z.string().min(1),
  businessDescription: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(1),
  alternatePhone: z.string().optional(),
  address: z.string().min(1),
  city: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.enum(["instagram", "facebook", "twitter", "linkedin", "youtube"]),
        url: z.string().url(),
      }),
    )
    .default([]),
  supportEmail: z.string().email().optional().or(z.literal("")),
  supportPhone: z.string().optional(),
  supportHours: z.string().optional(),
  businessHours: z
    .array(
      z.object({
        day: z.string(),
        openTime: z.string(),
        closeTime: z.string(),
        isClosed: z.boolean().default(false),
      }),
    )
    .default([]),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  shippingPolicy: z
    .object({
      isFree: z.boolean().default(true),
      cost: z.coerce.number().optional(),
      currency: z.string().default("GBP"),
      countries: z.array(z.string()).default(["GB", "US", "CA"]),
      handlingTimeDays: z
        .object({
          min: z.coerce.number().default(1),
          max: z.coerce.number().default(3),
        })
        .default({ min: 1, max: 3 }),
      transitTimeDays: z
        .object({
          min: z.coerce.number().default(3),
          max: z.coerce.number().default(10),
        })
        .default({ min: 3, max: 10 }),
    })
    .default({
      isFree: true,
      currency: "GBP",
      countries: ["GB", "US", "CA"],
      handlingTimeDays: { min: 1, max: 3 },
      transitTimeDays: { min: 3, max: 10 },
    }),
  returnPolicy: z
    .object({
      returnDays: z.coerce.number().default(14),
      returnFees: z
        .enum(["FreeReturn", "ReturnShippingFees", "ReturnFeesCustomerResponsibility"])
        .default("ReturnFeesCustomerResponsibility"),
    })
    .default({ returnDays: 14, returnFees: "ReturnFeesCustomerResponsibility" }),
});
export type SettingsFormValues = z.input<typeof settingsSchema>;

export const adminUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8).optional().or(z.literal("")),
  role: z.enum(["superadmin", "admin", "content_manager", "seo_manager"]),
  isActive: z.boolean().default(true),
});
export type AdminUserFormValues = z.input<typeof adminUserSchema>;
