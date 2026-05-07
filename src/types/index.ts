export type AdminRole = "superadmin" | "admin" | "content_manager" | "seo_manager";

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: AdminRole;
  permissions: string[];
  isActive?: boolean;
  lastLogin?: string;
}

export interface ApiPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiList<T> {
  success: boolean;
  data: T[];
  pagination: ApiPagination;
}

export interface ApiObject<T> {
  success: boolean;
  data: T;
}

export type ProductType = "antique" | "jewelry" | "coin";

export interface ProductImage {
  url: string;
  caption?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Product {
  _id: string;
  title: string;
  itemNumber: string;
  productType: ProductType;
  category: string;
  categoryId?: string;
  subcategoryId?: string;
  price: number;
  priceDisplay?: string;
  description?: string;
  images?: ProductImage[];
  isAvailable: boolean;
  isFeatured: boolean;
  isHighlight?: boolean;
  ageRangeId?: string;
  ageRangeLabel?: string;
  yearEstimate?: { startYear?: number; endYear?: number };
  specifications?: Record<string, string>;
  slug?: string;
  displayOrder?: number;
  relatedProductIds?: string[];
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  displayOrder: number;
  isActive: boolean;
  productsCount?: number;
  subcategoriesCount?: number;
  subcategories?: Subcategory[];
}

export interface AgeRange {
  _id: string;
  label: string;
  slug: string;
  startYear: number;
  endYear: number;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  productsCount?: number;
}

export interface GlobalSEO {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string[];
  siteAuthor?: string;
  siteLanguage: string;
  baseUrl: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterHandle?: string;
  googleAnalyticsId?: string;
  googleSearchConsoleId?: string;
  enableSitemap: boolean;
  enableRobotsTxt: boolean;
  indexingEnabled: boolean;
}

export interface PageSEO {
  id?: string;
  pageSlug: string;
  entityType?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  metaRobots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  structuredData?: Record<string, unknown>;
  h1?: string;
  h2s?: string[];
  internalLinks?: { url: string; anchorText: string; rel?: string }[];
}

export interface EntitySEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: Record<string, unknown>;
}

export interface Redirect {
  _id: string;
  fromUrl: string;
  toUrl: string;
  type: "301" | "302";
  isActive: boolean;
}

export interface HeroSlide {
  image: string;
  title: string;
  subtitle?: string;
  displayOrder: number;
}

export interface HomepageSection {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  content?: string;
  sectionType: "featured" | "story" | "acquired" | "treasures" | "collections" | "highlights";
  displayOrder: number;
  isVisible: boolean;
}

export interface CTAButton {
  text: string;
  url: string;
  style: "primary" | "secondary";
}

export interface HomepageContent {
  heroSlideshow: HeroSlide[];
  sections: HomepageSection[];
  featuredProductIds: string[];
  ctaButtons: CTAButton[];
}

export interface StaticPage {
  pageSlug: string;
  pageTitle: string;
  content: string;
  isPublished: boolean;
}

export type EnquiryStatus = "new" | "contacted" | "archived";

export interface Enquiry {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  message: string;
  productId?: string;
  productTitle?: string;
  status: EnquiryStatus;
  isRead: boolean;
  adminNotes?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface SocialLink {
  platform: "instagram" | "facebook" | "twitter" | "linkedin" | "youtube";
  url: string;
}

export interface BusinessHour {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface SiteSettings {
  businessName: string;
  businessDescription?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city?: string;
  country?: string;
  zipCode?: string;
  socialLinks: SocialLink[];
  supportEmail?: string;
  supportPhone?: string;
  supportHours?: string;
  businessHours: BusinessHour[];
  logoUrl?: string;
  faviconUrl?: string;
}

export interface ApiError {
  code?: string;
  message: string;
  errors?: Record<string, string>;
}
