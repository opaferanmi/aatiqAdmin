import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCategories } from "@/lib/hooks/useCategories";
import { useCategorySeo, useUpdateCategorySeo } from "@/lib/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { TagInput } from "@/components/ui-extras/TagInput";
import { entitySeoSchema, type EntitySeoFormValues } from "@/lib/validations/seoSchema";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

export function CategorySEOPage() {
  const cats = useCategories();
  const [categoryId, setCategoryId] = useState<string>("");
  const seo = useCategorySeo(categoryId || undefined);
  const update = useUpdateCategorySeo(categoryId);

  const form = useForm<EntitySeoFormValues>({
    resolver: zodResolver(entitySeoSchema),
    defaultValues: {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
      ogImage: "",
      canonicalUrl: "",
    },
  });

  useEffect(() => {
    if (seo.data) form.reset(seo.data as EntitySeoFormValues);
  }, [seo.data, form]);

  return (
    <div>
      <PageHeader title="Category SEO" description="Per-category SEO overrides" />
      <Card className="mb-4">
        <CardContent className="p-4">
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {cats.data?.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {categoryId && (
        <Card>
          <CardContent className="p-6">
            <form
              onSubmit={form.handleSubmit(async (v) => {
                try {
                  await update.mutateAsync(v);
                  toast.success("Saved");
                } catch (e) {
                  toast.error(getApiErrorMessage(e));
                }
              })}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label>Meta Title</Label>
                <Input {...form.register("metaTitle")} />
              </div>
              <div className="space-y-1.5">
                <Label>Meta Description</Label>
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
                <Label>OG Image URL</Label>
                <Input {...form.register("ogImage")} />
              </div>
              <div className="space-y-1.5">
                <Label>Canonical URL</Label>
                <Input {...form.register("canonicalUrl")} />
              </div>
              <Button type="submit" disabled={update.isPending}>
                {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save SEO
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
