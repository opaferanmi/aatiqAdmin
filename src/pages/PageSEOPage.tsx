import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Pencil } from "lucide-react";
import { usePageSeoList, useCreatePageSeo, useUpdatePageSeo } from "@/lib/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { EmptyState } from "@/components/ui-extras/EmptyState";
import { LoadingSpinner } from "@/components/ui-extras/LoadingSpinner";
import { TagInput } from "@/components/ui-extras/TagInput";
import { SingleImageUploader } from "@/components/ui-extras/ImageUploader";
import { pageSeoSchema, type PageSeoFormValues } from "@/lib/validations/seoSchema";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import type { PageSEO } from "@/types";

export function PageSEOPage() {
  const { data, isLoading } = usePageSeoList();
  const [editing, setEditing] = useState<PageSEO | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <PageHeader
        title="Page SEO"
        description="Per-page SEO configuration"
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Page SEO
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Slug</TableHead>
                  <TableHead>Meta Title</TableHead>
                  <TableHead>Meta Description</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.length ?? 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0">
                      <EmptyState
                        title="No page SEO configured yet"
                        description="Add SEO meta for static pages like about, contact, terms."
                      />
                    </TableCell>
                  </TableRow>
                )}
                {data?.map((p) => (
                  <TableRow key={p.id ?? p.pageSlug}>
                    <TableCell className="font-medium">{p.pageSlug}</TableCell>
                    <TableCell className="max-w-xs truncate">{p.metaTitle}</TableCell>
                    <TableCell className="max-w-md truncate text-sm text-muted-foreground">
                      {p.metaDescription}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <PageSeoSheet
        open={creating || !!editing}
        onOpenChange={(o) => {
          if (!o) {
            setCreating(false);
            setEditing(null);
          }
        }}
        initial={editing ?? undefined}
      />
    </div>
  );
}

function PageSeoSheet({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: PageSEO;
}) {
  const create = useCreatePageSeo();
  const update = useUpdatePageSeo(initial?.id ?? "");

  const form = useForm<PageSeoFormValues>({
    resolver: zodResolver(pageSeoSchema),
    defaultValues: {
      pageSlug: "",
      entityType: "page",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
      metaRobots: "index, follow",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      canonicalUrl: "",
      h1: "",
    },
  });

  useEffect(() => {
    form.reset({
      pageSlug: initial?.pageSlug ?? "",
      entityType: initial?.entityType ?? "page",
      metaTitle: initial?.metaTitle ?? "",
      metaDescription: initial?.metaDescription ?? "",
      metaKeywords: initial?.metaKeywords ?? [],
      metaRobots: initial?.metaRobots ?? "index, follow",
      ogTitle: initial?.ogTitle ?? "",
      ogDescription: initial?.ogDescription ?? "",
      ogImage: initial?.ogImage ?? "",
      canonicalUrl: initial?.canonicalUrl ?? "",
      h1: initial?.h1 ?? "",
    });
  }, [initial, form]);

  const submitting = create.isPending || update.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{initial ? "Edit Page SEO" : "New Page SEO"}</SheetTitle>
        </SheetHeader>
        <form
          onSubmit={form.handleSubmit(async (v) => {
            try {
              if (initial?.id) {
                await update.mutateAsync(v);
                toast.success("Updated");
              } else {
                await create.mutateAsync(v);
                toast.success("Created");
              }
              onOpenChange(false);
            } catch (e) {
              toast.error(getApiErrorMessage(e));
            }
          })}
          className="space-y-4 px-4 py-4"
        >
          <div className="space-y-1.5">
            <Label>Page Slug *</Label>
            <Input placeholder="about" {...form.register("pageSlug")} />
          </div>
          <div className="space-y-1.5">
            <Label>Meta Title *</Label>
            <Input {...form.register("metaTitle")} />
          </div>
          <div className="space-y-1.5">
            <Label>Meta Description *</Label>
            <Textarea rows={3} {...form.register("metaDescription")} />
          </div>
          <div className="space-y-1.5">
            <Label>Meta Keywords</Label>
            <Controller
              control={form.control}
              name="metaKeywords"
              render={({ field }) => (
                <TagInput value={field.value ?? []} onChange={field.onChange} />
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Meta Robots</Label>
            <Input placeholder="index, follow" {...form.register("metaRobots")} />
          </div>
          <div className="space-y-1.5">
            <Label>H1</Label>
            <Input {...form.register("h1")} />
          </div>
          <div className="space-y-1.5">
            <Label>Open Graph Title</Label>
            <Input {...form.register("ogTitle")} />
          </div>
          <div className="space-y-1.5">
            <Label>Open Graph Description</Label>
            <Textarea rows={2} {...form.register("ogDescription")} />
          </div>
          <div className="space-y-1.5">
            <Label>Open Graph Image</Label>
            <Controller
              control={form.control}
              name="ogImage"
              render={({ field }) => (
                <SingleImageUploader
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  folder="seo"
                />
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Canonical URL</Label>
            <Input {...form.register("canonicalUrl")} />
          </div>
          <SheetFooter>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initial ? "Save" : "Create"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
