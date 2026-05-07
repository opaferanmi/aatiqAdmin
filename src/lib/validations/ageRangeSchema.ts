import { z } from "zod";

export const ageRangeSchema = z.object({
  label: z.string().min(1, "Label is required"),
  slug: z.string().min(1, "Slug is required"),
  startYear: z.coerce.number().int(),
  endYear: z.coerce.number().int(),
  description: z.string().optional(),
  displayOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export type AgeRangeFormValues = z.input<typeof ageRangeSchema>;
