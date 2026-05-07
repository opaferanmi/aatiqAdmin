import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/lib/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { EmptyState } from "@/components/ui-extras/EmptyState";
import { ConfirmDialog } from "@/components/ui-extras/ConfirmDialog";
import { SingleImageUploader } from "@/components/ui-extras/ImageUploader";
import { categorySchema, type CategoryFormValues } from "@/lib/validations/categorySchema";
import { ADMIN_PERMISSIONS, usePermission } from "@/lib/utils/permissions";
import { slugify } from "@/lib/utils/formatters";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

export function CategoriesPage() {
  const { can } = usePermission();
  const { data, isLoading } = useCategories();
  const create = useCreateCategory();
  const remove = useDeleteCategory();
  const [open, setOpen] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: "",
      displayOrder: 0,
      isActive: true,
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      toast.success("Category deleted");
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Group your inventory by category and subcategory"
        actions={
          can(ADMIN_PERMISSIONS.CREATE_CATEGORY) && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full overflow-y-auto sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>New Category</SheetTitle>
                </SheetHeader>
                <form
                  onSubmit={form.handleSubmit(async (v) => {
                    try {
                      await create.mutateAsync(v);
                      toast.success("Category created");
                      form.reset();
                      setOpen(false);
                    } catch (e) {
                      toast.error(getApiErrorMessage(e));
                    }
                  })}
                  className="space-y-4 px-4 py-4"
                >
                  <div className="space-y-1.5">
                    <Label>Name *</Label>
                    <Input
                      {...form.register("name")}
                      onBlur={(e) => {
                        if (!form.getValues("slug")) {
                          form.setValue("slug", slugify(e.target.value));
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Slug *</Label>
                    <Input {...form.register("slug")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <Textarea rows={3} {...form.register("description")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Image</Label>
                    <Controller
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <SingleImageUploader
                          value={field.value}
                          onChange={field.onChange}
                          folder="categories"
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Display Order</Label>
                    <Input type="number" {...form.register("displayOrder")} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Active</Label>
                    <Controller
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                  </div>
                  <SheetFooter>
                    <Button type="submit" disabled={create.isPending}>
                      Create
                    </Button>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
          )
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Subcategories</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoading && (data?.length ?? 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="p-0">
                      <EmptyState
                        title="No categories yet"
                        description="Create your first category to organize your products."
                      />
                    </TableCell>
                  </TableRow>
                )}
                {data?.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell>
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                          <span className="text-xs text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="font-mono text-xs">{c.slug}</TableCell>
                    <TableCell>{c.productsCount ?? 0}</TableCell>
                    <TableCell>{c.subcategoriesCount ?? 0}</TableCell>
                    <TableCell>
                      <Badge variant={c.isActive ? "default" : "secondary"}>
                        {c.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {can(ADMIN_PERMISSIONS.EDIT_CATEGORY) && (
                          <Button variant="ghost" size="icon" asChild>
                            <Link to="/dashboard/categories/$id" params={{ id: c._id }}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        {can(ADMIN_PERMISSIONS.DELETE_CATEGORY) && (
                          <ConfirmDialog
                            trigger={
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            }
                            title="Delete this category?"
                            description="This may affect products linked to this category."
                            destructive
                            onConfirm={() => handleDelete(c._id)}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
