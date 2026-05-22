import { type ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Clock,
  Search,
  FileText,
  Inbox,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/store/authStore";
import { ADMIN_PERMISSIONS, usePermission } from "@/lib/utils/permissions";
import { authApi } from "@/lib/api/auth";
import { initials } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  superadminOnly?: boolean;
  match?: (path: string) => boolean;
}

const NAV: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, match: (p) => p === "/dashboard" },
  {
    label: "Products",
    to: "/dashboard/products",
    icon: Package,
    permission: ADMIN_PERMISSIONS.VIEW_PRODUCTS,
    match: (p) => p.startsWith("/dashboard/products"),
  },
  {
    label: "Categories",
    to: "/dashboard/categories",
    icon: FolderTree,
    permission: ADMIN_PERMISSIONS.VIEW_CATEGORIES,
    match: (p) => p.startsWith("/dashboard/categories"),
  },
  {
    label: "Age Ranges",
    to: "/dashboard/age-ranges",
    icon: Clock,
    permission: ADMIN_PERMISSIONS.VIEW_CATEGORIES,
    match: (p) => p.startsWith("/dashboard/age-ranges"),
  },
  {
    label: "SEO",
    to: "/dashboard/seo",
    icon: Search,
    permission: ADMIN_PERMISSIONS.VIEW_SEO_SETTINGS,
    match: (p) => p.startsWith("/dashboard/seo"),
  },
  {
    label: "Content",
    to: "/dashboard/content",
    icon: FileText,
    permission: ADMIN_PERMISSIONS.VIEW_CONTENT,
    match: (p) => p.startsWith("/dashboard/content"),
  },
  {
    label: "Enquiries",
    to: "/dashboard/enquiries",
    icon: Inbox,
    permission: ADMIN_PERMISSIONS.VIEW_ENQUIRIES,
    match: (p) => p.startsWith("/dashboard/enquiries"),
  },
  {
    label: "Consignments",
    to: "/dashboard/consignments",
    icon: Inbox,
    // permission: ADMIN_PERMISSIONS.VIEW_CONSIGNMENTS,
    match: (p) => p.startsWith("/dashboard/consignments"),
  },
  {
    label: "Settings",
    to: "/dashboard/settings",
    icon: Settings,
    permission: ADMIN_PERMISSIONS.MANAGE_SETTINGS,
    match: (p) =>
      p.startsWith("/dashboard/settings") && !p.startsWith("/dashboard/settings/admin-users"),
  },
  {
    label: "Admin Users",
    to: "/dashboard/settings/admin-users",
    icon: Users,
    superadminOnly: true,
    match: (p) => p.startsWith("/dashboard/settings/admin-users"),
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const { can, isSuperAdmin } = usePermission();

  const items = NAV.filter((item) => {
    if (item.superadminOnly) return isSuperAdmin();
    if (!item.permission) return true;
    return can(item.permission);
  });

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link to="/dashboard" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Package className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Antiques Admin</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active = item.match ? item.match(location.pathname) : location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <p className="px-2 text-xs uppercase tracking-wider text-sidebar-foreground/50">
          Luxury Antiques • Admin
        </p>
      </div>
    </div>
  );
}

function Header({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const navigate = useNavigate();
  const admin = useAuthStore((s) => s.admin);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium text-foreground/80">Admin Console</span>
      </div>
      <div className="flex items-center gap-2">
        {admin?.role && (
          <Badge variant="outline" className="hidden sm:inline-flex">
            {admin.role.replace("_", " ")}
          </Badge>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {initials(admin?.firstName, admin?.lastName)}
              </span>
              <span className="hidden sm:inline">
                {admin?.firstName} {admin?.lastName}
              </span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">
                {admin?.firstName} {admin?.lastName}
              </div>
              <div className="text-xs font-normal text-muted-foreground">{admin?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-sidebar shadow-xl">
            <div className="flex h-16 items-center justify-end px-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="-mt-16">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <Header onOpenSidebar={() => setMobileOpen(true)} />
        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
