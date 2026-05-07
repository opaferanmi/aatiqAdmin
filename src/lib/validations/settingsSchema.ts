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
