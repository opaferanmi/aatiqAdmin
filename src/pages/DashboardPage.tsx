import { Link } from "@tanstack/react-router";
import { Package, FolderTree, Inbox, Clock, Plus, Eye } from "lucide-react";
import { useProducts } from "@/lib/hooks/useProducts";
import { useCategories } from "@/lib/hooks/useCategories";
import { useEnquiries } from "@/lib/hooks/useEnquiries";
import { useAgeRanges } from "@/lib/hooks/useAgeRanges";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { ADMIN_PERMISSIONS, usePermission } from "@/lib/utils/permissions";
import { formatDate } from "@/lib/utils/formatters";

function StatCard({
  label,
  value,
  icon: Icon,
  loading,
  to,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  to?: string;
}) {
  const inner = (
    <Card className="transition hover:border-primary/50 hover:shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{loading ? "—" : value}</p>
        </div>
      </CardContent>
    </Card>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export function DashboardPage() {
  const { admin, can } = usePermission();
  const products = useProducts({ page: 1, limit: 1 });
  const categories = useCategories();
  const ageRanges = useAgeRanges();
  const newEnquiries = useEnquiries({ status: "new", page: 1, limit: 5 });

  return (
    <div>
      <PageHeader
        title={`Welcome, ${admin?.firstName ?? "Admin"}`}
        description="Here's a quick snapshot of your store."
        actions={
          <>
            {can(ADMIN_PERMISSIONS.CREATE_PRODUCT) && (
              <Button asChild>
                <Link to="/dashboard/products/create">
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Link>
              </Button>
            )}
            {can(ADMIN_PERMISSIONS.VIEW_ENQUIRIES) && (
              <Button variant="outline" asChild>
                <Link to="/dashboard/enquiries">
                  <Eye className="mr-2 h-4 w-4" /> View Enquiries
                </Link>
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Products"
          value={products.data?.pagination?.total ?? 0}
          icon={Package}
          loading={products.isLoading}
          to="/dashboard/products"
        />
        <StatCard
          label="Total Categories"
          value={categories.data?.length ?? 0}
          icon={FolderTree}
          loading={categories.isLoading}
          to="/dashboard/categories"
        />
        <StatCard
          label="New Enquiries"
          value={newEnquiries.data?.pagination?.total ?? 0}
          icon={Inbox}
          loading={newEnquiries.isLoading}
          to="/dashboard/enquiries"
        />
        <StatCard
          label="Age Ranges"
          value={ageRanges.data?.length ?? 0}
          icon={Clock}
          loading={ageRanges.isLoading}
          to="/dashboard/age-ranges"
        />
      </div>

      {can(ADMIN_PERMISSIONS.VIEW_ENQUIRIES) && (
        <Card className="mt-8">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="text-base font-semibold">Recent Enquiries</h2>
                <p className="text-xs text-muted-foreground">Last 5 unread enquiries</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/enquiries">View all</Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {newEnquiries.isLoading && (
                <div className="p-6 text-sm text-muted-foreground">Loading...</div>
              )}
              {!newEnquiries.isLoading && (newEnquiries.data?.data?.length ?? 0) === 0 && (
                <div className="p-6 text-sm text-muted-foreground">No new enquiries right now.</div>
              )}
              {newEnquiries.data?.data?.map((e) => (
                <Link
                  key={e._id}
                  to="/dashboard/enquiries/$id"
                  params={{ id: e._id }}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {e.firstName} {e.lastName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{e.email}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {e.productTitle && (
                      <span className="hidden truncate text-muted-foreground sm:inline">
                        {e.productTitle}
                      </span>
                    )}
                    <Badge variant={e.status === "new" ? "default" : "secondary"}>{e.status}</Badge>
                    <span className="hidden text-muted-foreground sm:inline">
                      {formatDate(e.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
