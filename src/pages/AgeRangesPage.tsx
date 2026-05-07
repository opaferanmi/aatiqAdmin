import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useAgeRanges,
  useCreateAgeRange,
  useDeleteAgeRange,
  useUpdateAgeRange,
} from "@/lib/hooks/useAgeRanges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { EmptyState } from "@/components/ui-extras/EmptyState";
import { ConfirmDialog } from "@/components/ui-extras/ConfirmDialog";
import { ageRangeSchema, type AgeRangeFormValues } from "@/lib/validations/ageRangeSchema";
import { slugify } from "@/lib/utils/formatters";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import type { AgeRange } from "@/types";

export function AgeRangesPage() {
  const { data, isLoading } = useAgeRanges();
  const create = useCreateAgeRange();
  const remove = useDeleteAgeRange();
  const [editing, setEditing] = useState<AgeRange | null>(null);
  const [creating, setCreating] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      toast.success("Deleted");
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  return (
    <div>
      <PageHeader
        title="Age Ranges"
        description="Define historical periods used to label antiques"
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Age Range
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Years</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Order</TableHead>
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
                      <EmptyState title="No age ranges yet" />
                    </TableCell>
                  </TableRow>
                )}
                {data?.map((a) => (
                  <TableRow key={a._id}>
                    <TableCell className="font-medium">{a.label}</TableCell>
                    <TableCell className="font-mono text-xs">{a.slug}</TableCell>
                    <TableCell>
                      {a.startYear} – {a.endYear}
                    </TableCell>
                    <TableCell>{a.productsCount ?? 0}</TableCell>
                    <TableCell>{a.displayOrder}</TableCell>
                    <TableCell>
                      <Badge variant={a.isActive ? "default" : "secondary"}>
                        {a.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(a)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          }
                          title="Delete age range?"
                          destructive
                          onConfirm={() => handleDelete(a._id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AgeRangeSheet
        open={creating || !!editing}
        onOpenChange={(o) => {
          if (!o) {
            setCreating(false);
            setEditing(null);
          }
        }}
        initial={editing ?? undefined}
        onSubmit={async (values) => {
          try {
            if (editing) {
              // updateMutation needs a fresh call per id
              const { ageRangesApi } = await import("@/lib/api/ageRanges");
              await ageRangesApi.update(editing._id, values);
              toast.success("Updated");
            } else {
              await create.mutateAsync(values);
              toast.success("Created");
            }
            setCreating(false);
            setEditing(null);
            // re-fetch
            const { default: queryClient } = await import("@tanstack/react-query").then(() => ({
              default: undefined,
            }));
            void queryClient;
          } catch (e) {
            toast.error(getApiErrorMessage(e));
          }
        }}
      />
    </div>
  );
}

function AgeRangeSheet({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: AgeRange;
  onSubmit: (values: AgeRangeFormValues) => Promise<void>;
}) {
  const update = useUpdateAgeRange(initial?._id ?? "");
  const form = useForm<AgeRangeFormValues>({
    resolver: zodResolver(ageRangeSchema),
    defaultValues: {
      label: initial?.label ?? "",
      slug: initial?.slug ?? "",
      startYear: initial?.startYear ?? 1900,
      endYear: initial?.endYear ?? 2000,
      description: initial?.description ?? "",
      displayOrder: initial?.displayOrder ?? 0,
      isActive: initial?.isActive ?? true,
    },
  });

  useEffect(() => {
    form.reset({
      label: initial?.label ?? "",
      slug: initial?.slug ?? "",
      startYear: initial?.startYear ?? 1900,
      endYear: initial?.endYear ?? 2000,
      description: initial?.description ?? "",
      displayOrder: initial?.displayOrder ?? 0,
      isActive: initial?.isActive ?? true,
    });
  }, [initial, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{initial ? "Edit Age Range" : "New Age Range"}</SheetTitle>
        </SheetHeader>
        <form
          onSubmit={form.handleSubmit(async (v) => {
            if (initial) {
              try {
                await update.mutateAsync(v);
                toast.success("Updated");
                onOpenChange(false);
              } catch (e) {
                toast.error(getApiErrorMessage(e));
              }
            } else {
              await onSubmit(v);
            }
          })}
          className="space-y-4 px-4 py-4"
        >
          <div className="space-y-1.5">
            <Label>Label *</Label>
            <Input
              {...form.register("label")}
              onBlur={(e) => {
                if (!form.getValues("slug")) form.setValue("slug", slugify(e.target.value));
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Slug *</Label>
            <Input {...form.register("slug")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Start Year *</Label>
              <Input type="number" {...form.register("startYear")} />
            </div>
            <div className="space-y-1.5">
              <Label>End Year *</Label>
              <Input type="number" {...form.register("endYear")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea rows={3} {...form.register("description")} />
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
