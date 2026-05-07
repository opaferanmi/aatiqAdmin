import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Search, Star } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProducts, useDeleteProduct, useToggleFeatured } from "@/lib/hooks/useProducts";
import { useCategories } from "@/lib/hooks/useCategories";
import { productsApi } from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { EmptyState } from "@/components/ui-extras/EmptyState";
import { ConfirmDialog } from "@/components/ui-extras/ConfirmDialog";
import { ADMIN_PERMISSIONS, usePermission } from "@/lib/utils/permissions";
import { formatPrice } from "@/lib/utils/formatters";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

export function ProductsPage() {
  const { can } = usePermission();
  const [page, setPage] = useState(1);
  const [type, setType] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useProducts({
    page,
    limit: 20,
    type: type === "all" ? undefined : type,
    category: category === "all" ? undefined : category,
    search: search || undefined,
  });
  const { data: categories } = useCategories();
  const deleteMutation = useDeleteProduct();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Product deleted");
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };
  const toggleFeatured = useToggleFeatured();

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await toggleFeatured.mutateAsync({ id, isFeatured: !currentFeatured });
      toast.success(!currentFeatured ? "Product featured" : "Product unfeatured");
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your antique inventory"
        actions={
          can(ADMIN_PERMISSIONS.CREATE_PRODUCT) && (
            <Button asChild>
              <Link to="/dashboard/products/create">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Link>
            </Button>
          )
        }
      />

      <Card className="mb-4">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search products..."
              className="pl-9"
            />
          </div>
          <Select
            value={type}
            onValueChange={(v) => {
              setType(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="antique">Antique</SelectItem>
              <SelectItem value="jewelry">Jewelry</SelectItem>
              <SelectItem value="coin">Coin</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories?.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Item #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoading && (data?.data?.length ?? 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="p-0">
                      <EmptyState
                        title="No products yet"
                        description="Create your first product to get started."
                      />
                    </TableCell>
                  </TableRow>
                )}
                {data?.data?.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>
                      {p.images && p.images.length > 0 ? (
                        <img
                          src={p.images[0].url}
                          alt={p.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-muted" />
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{p.title}</span>
                        {p.isFeatured && (
                          <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{p.itemNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {p.productType}
                      </Badge>
                    </TableCell>
                    <TableCell>{p.priceDisplay ?? formatPrice(p.price)}</TableCell>
                    <TableCell>
                      <Badge variant={p.isAvailable ? "default" : "secondary"}>
                        {p.isAvailable ? "Available" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {can(ADMIN_PERMISSIONS.EDIT_PRODUCT) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleFeatured(p._id, p.isFeatured)}
                            title={p.isFeatured ? "Remove from featured" : "Add to featured"}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                p.isFeatured
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </Button>
                        )}
                        {can(ADMIN_PERMISSIONS.EDIT_PRODUCT) && (
                          <Button variant="ghost" size="icon" asChild>
                            <Link to="/dashboard/products/$id" params={{ id: p._id }}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        {can(ADMIN_PERMISSIONS.DELETE_PRODUCT) && (
                          <ConfirmDialog
                            trigger={
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            }
                            title="Delete this product?"
                            description="This action cannot be undone."
                            destructive
                            confirmText="Delete"
                            onConfirm={() => handleDelete(p._id)}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border p-4 text-sm">
              <span className="text-muted-foreground">
                Page {data.pagination.page} of {data.pagination.totalPages} •{" "}
                {data.pagination.total} total
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.pagination.hasPrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.pagination.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
