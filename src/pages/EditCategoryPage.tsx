import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { LoadingSpinner } from "@/components/ui-extras/LoadingSpinner";
import { ConfirmDialog } from "@/components/ui-extras/ConfirmDialog";
import { SingleImageUploader } from "@/components/ui-extras/ImageUploader";
import {
  useCategory,
  useUpdateCategory,
  useCreateSubcategory,
  useUpdateSubcategory,
  useDeleteSubcategory,
} from "@/lib/hooks/useCategories";
import {
  categorySchema,
  subcategorySchema,
  type CategoryFormValues,
  type SubcategoryFormValues,
} from "@/lib/validations/categorySchema";
import { slugify } from "@/lib/utils/formatters";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import type { Subcategory } from "@/types";

export function EditCategoryPage() {
  const { id } = useParams({ from: "/dashboard/categories/$id" });
  const { data, isLoading } = useCategory(id);
  const update = useUpdateCategory(id);
  const createSub = useCreateSubcategory(id);
  const updateSub = useUpdateSubcategory(id);
  const deleteSub = useDeleteSubcategory(id);

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

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        slug: data.slug,
        description: data.description ?? "",
        image: data.image ?? "",
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      });
    }
  }, [data, form]);

  const [editingSub, setEditingSub] = useState<Subcategory | null>(null);
  const [creatingSub, setCreatingSub] = useState(false);

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-2">
        <Link to="/dashboard/categories">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to categories
        </Link>
      </Button>
      <PageHeader title="Edit Category" description={data?.name} />

      {isLoading || !data ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Category Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={form.handleSubmit(async (v) => {
                    try {
                      await update.mutateAsync(v);
                      toast.success("Category updated");
                    } catch (e) {
                      toast.error(getApiErrorMessage(e));
                    }
                  })}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Name *</Label>
                      <Input {...form.register("name")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Slug *</Label>
                      <Input {...form.register("slug")} />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
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
                    <div className="flex items-center justify-between sm:col-span-2">
                      <Label>Active</Label>
                      <Controller
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={update.isPending}>
                    {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Subcategories</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setCreatingSub(true)}>
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {(data.subcategories?.length ?? 0) === 0 && (
                  <p className="text-sm text-muted-foreground">No subcategories yet.</p>
                )}
                {data.subcategories?.map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center justify-between rounded-md border border-border p-3 text-sm"
                  >
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">{s.slug}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant={s.isActive ? "default" : "secondary"}>
                        {s.isActive ? "Active" : "Off"}
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => setEditingSub(s)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        }
                        title="Delete subcategory?"
                        destructive
                        onConfirm={async () => {
                          try {
                            await deleteSub.mutateAsync(s._id);
                            toast.success("Deleted");
                          } catch (e) {
                            toast.error(getApiErrorMessage(e));
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Subcategory editor sheet */}
      <SubcategorySheet
        open={creatingSub || !!editingSub}
        onOpenChange={(o) => {
          if (!o) {
            setCreatingSub(false);
            setEditingSub(null);
          }
        }}
        initial={editingSub ?? undefined}
        onSubmit={async (values) => {
          try {
            if (editingSub) {
              await updateSub.mutateAsync({ subId: editingSub._id, payload: values });
              toast.success("Updated");
            } else {
              await createSub.mutateAsync(values);
              toast.success("Created");
            }
            setCreatingSub(false);
            setEditingSub(null);
          } catch (e) {
            toast.error(getApiErrorMessage(e));
          }
        }}
      />
    </div>
  );
}

function SubcategorySheet({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: Subcategory;
  onSubmit: (values: SubcategoryFormValues) => Promise<void>;
}) {
  const form = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      description: initial?.description ?? "",
      image: initial?.image ?? "",
      displayOrder: initial?.displayOrder ?? 0,
      isActive: initial?.isActive ?? true,
    },
  });

  useEffect(() => {
    form.reset({
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      description: initial?.description ?? "",
      image: initial?.image ?? "",
      displayOrder: initial?.displayOrder ?? 0,
      isActive: initial?.isActive ?? true,
    });
  }, [initial, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{initial ? "Edit Subcategory" : "New Subcategory"}</SheetTitle>
        </SheetHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4 py-4">
          <div className="space-y-1.5">
            <Label>Name *</Label>
            <Input
              {...form.register("name")}
              onBlur={(e) => {
                if (!form.getValues("slug")) form.setValue("slug", slugify(e.target.value));
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
                  folder="subcategories"
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
            <Button type="submit">{initial ? "Save" : "Create"}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
