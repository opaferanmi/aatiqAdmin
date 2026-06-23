import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  itemNumber: z.string().min(1, "Item number is required"),
  productType: z.enum(["antique", "jewelry", "coin"]),
  categoryId: z.string().min(1, "Category is required"),
  subcategoryId: z.string().optional().or(z.literal("")),
  price: z.coerce.number().min(0, "Price must be positive"),
  priceDisplay: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        caption: z.string().optional(),
        isPrimary: z.boolean(),
        displayOrder: z.number(),
      }),
    )
    .default([]),
  specifications: z.record(z.string(), z.string()).optional().default({}),
  ageRangeId: z.string().optional().or(z.literal("")),
  ageRangeLabel: z.string().optional(),
  yearEstimate: z
    .object({
      startYear: z.coerce.number().optional(),
      endYear: z.coerce.number().optional(),
    })
    .optional(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isHighlight: z.boolean().default(false),
  brand: z.string().optional(),
  displayOrder: z.coerce.number().optional(),
  relatedProductIds: z.array(z.string()).optional().default([]),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional().default([]),
});

export type ProductFormValues = z.input<typeof productSchema>;
export type ProductFormOutput = z.output<typeof productSchema>;
