import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  displayOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export type CategoryFormValues = z.input<typeof categorySchema>;

export const subcategorySchema = categorySchema;
export type SubcategoryFormValues = z.input<typeof subcategorySchema>;
