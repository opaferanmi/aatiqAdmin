import { z } from "zod";

export const globalSeoSchema = z.object({
  siteTitle: z.string().min(1),
  siteDescription: z.string().min(1),
  siteKeywords: z.array(z.string()).default([]),
  siteAuthor: z.string().optional(),
  siteLanguage: z.string().default("en"),
  baseUrl: z.string().url(),
  ogImage: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  twitterHandle: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  googleSearchConsoleId: z.string().optional(),
  enableSitemap: z.boolean().default(true),
  enableRobotsTxt: z.boolean().default(true),
  indexingEnabled: z.boolean().default(true),
});
export type GlobalSeoFormValues = z.input<typeof globalSeoSchema>;

export const pageSeoSchema = z.object({
  pageSlug: z.string().min(1),
  entityType: z.string().default("page"),
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  metaKeywords: z.array(z.string()).default([]),
  metaRobots: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  ogUrl: z.string().optional(),
  ogType: z.string().optional(),
  twitterCard: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  h1: z.string().optional(),
  h2s: z.array(z.string()).optional(),
});
export type PageSeoFormValues = z.input<typeof pageSeoSchema>;

export const entitySeoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).default([]),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
});
export type EntitySeoFormValues = z.input<typeof entitySeoSchema>;

export const redirectSchema = z.object({
  fromUrl: z.string().min(1),
  toUrl: z.string().min(1),
  type: z.enum(["301", "302"]).default("301"),
});
export type RedirectFormValues = z.input<typeof redirectSchema>;
