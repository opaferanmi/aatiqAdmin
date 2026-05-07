import { useAuthStore } from "@/lib/store/authStore";
import type { AdminRole } from "@/types";

export const ADMIN_PERMISSIONS = {
  VIEW_PRODUCTS: "view_products",
  CREATE_PRODUCT: "create_product",
  EDIT_PRODUCT: "edit_product",
  DELETE_PRODUCT: "delete_product",
  VIEW_CATEGORIES: "view_categories",
  CREATE_CATEGORY: "create_category",
  EDIT_CATEGORY: "edit_category",
  DELETE_CATEGORY: "delete_category",
  VIEW_SEO_SETTINGS: "view_seo_settings",
  EDIT_GLOBAL_SEO: "edit_global_seo",
  EDIT_PAGE_SEO: "edit_page_seo",
  EDIT_PRODUCT_SEO: "edit_product_seo",
  EDIT_CATEGORY_SEO: "edit_category_seo",
  MANAGE_REDIRECTS: "manage_redirects",
  MANAGE_INTERNAL_LINKS: "manage_internal_links",
  GENERATE_SITEMAP: "generate_sitemap",
  EDIT_HOMEPAGE: "edit_homepage",
  EDIT_STATIC_PAGES: "edit_static_pages",
  VIEW_CONTENT: "view_content",
  VIEW_ENQUIRIES: "view_enquiries",
  DELETE_ENQUIRY: "delete_enquiry",
  EXPORT_ENQUIRIES: "export_enquiries",
  MANAGE_SETTINGS: "manage_settings",
  MANAGE_ADMIN_USERS: "manage_admin_users",
} as const;

const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  superadmin: Object.values(ADMIN_PERMISSIONS),
  admin: Object.values(ADMIN_PERMISSIONS).filter((p) => p !== ADMIN_PERMISSIONS.MANAGE_ADMIN_USERS),
  content_manager: [
    ADMIN_PERMISSIONS.VIEW_PRODUCTS,
    ADMIN_PERMISSIONS.EDIT_HOMEPAGE,
    ADMIN_PERMISSIONS.EDIT_STATIC_PAGES,
    ADMIN_PERMISSIONS.VIEW_CONTENT,
  ],
  seo_manager: [
    ADMIN_PERMISSIONS.VIEW_SEO_SETTINGS,
    ADMIN_PERMISSIONS.EDIT_GLOBAL_SEO,
    ADMIN_PERMISSIONS.EDIT_PAGE_SEO,
    ADMIN_PERMISSIONS.EDIT_PRODUCT_SEO,
    ADMIN_PERMISSIONS.EDIT_CATEGORY_SEO,
    ADMIN_PERMISSIONS.MANAGE_REDIRECTS,
    ADMIN_PERMISSIONS.MANAGE_INTERNAL_LINKS,
    ADMIN_PERMISSIONS.GENERATE_SITEMAP,
  ],
};

export function getEffectivePermissions(
  role: AdminRole | undefined,
  explicit: string[] | undefined,
): string[] {
  if (explicit && explicit.includes("*")) return Object.values(ADMIN_PERMISSIONS);
  if (explicit && explicit.length > 0) return explicit;
  if (role && ROLE_PERMISSIONS[role]) return ROLE_PERMISSIONS[role];
  return [];
}
export function usePermission() {
  const admin = useAuthStore((s) => s.admin);
  const perms = getEffectivePermissions(admin?.role, admin?.permissions);

  const can = (permission: string): boolean => perms.includes(permission);
  const canAny = (permissions: string[]): boolean => permissions.some(can);
  const canAll = (permissions: string[]): boolean => permissions.every(can);
  const isSuperAdmin = (): boolean => admin?.role === "superadmin";
  const isAdmin = (): boolean => admin?.role === "admin" || isSuperAdmin();

  return { can, canAny, canAll, isSuperAdmin, isAdmin, admin };
}
