import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search } from "lucide-react";
import { useProducts } from "@/lib/hooks/useProducts";
import { useProductSeo, useUpdateProductSeo } from "@/lib/hooks/useSEO";
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
import { Controller } from "react-hook-form";
import { entitySeoSchema, type EntitySeoFormValues } from "@/lib/validations/seoSchema";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import { useEffect } from "react";

export function ProductSEOPage() {
  const products = useProducts({ page: 1, limit: 50 });
  const [productId, setProductId] = useState<string>("");
  const seo = useProductSeo(productId || undefined);
  const update = useUpdateProductSeo(productId);

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
      <PageHeader title="Product SEO" description="Per-product SEO overrides" />
      <Card className="mb-4">
        <CardContent className="flex items-center gap-3 p-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.data?.data?.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {productId && (
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
