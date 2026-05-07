import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagInput } from "@/components/ui-extras/TagInput";
import { ImageUploader } from "@/components/ui-extras/ImageUploader";
import { useCategories } from "@/lib/hooks/useCategories";
import { useAgeRanges } from "@/lib/hooks/useAgeRanges";
import { productSchema, type ProductFormValues } from "@/lib/validations/productSchema";
import { slugify } from "@/lib/utils/formatters";
import type { Product } from "@/types";

interface Props {
  defaultValues?: Partial<Product>;
  submitting?: boolean;
  submitLabel?: string;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
}

export function ProductForm({ defaultValues, submitting, submitLabel = "Save", onSubmit }: Props) {
  const { data: categories } = useCategories();
  const { data: ageRanges } = useAgeRanges();

  const initial = useMemo<ProductFormValues>(
    () => ({
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      itemNumber: defaultValues?.itemNumber ?? "",
      productType: defaultValues?.productType ?? "antique",
      categoryId: defaultValues?.categoryId ?? "",
      subcategoryId: defaultValues?.subcategoryId ?? "",
      price: defaultValues?.price ?? 0,
      priceDisplay: defaultValues?.priceDisplay ?? "",
      slug: defaultValues?.slug ?? "",
      images: defaultValues?.images ?? [],
      specifications: defaultValues?.specifications ?? {},
      ageRangeId: defaultValues?.ageRangeId ?? "",
      ageRangeLabel: defaultValues?.ageRangeLabel ?? "",
      yearEstimate: defaultValues?.yearEstimate ?? { startYear: undefined, endYear: undefined },
      isAvailable: defaultValues?.isAvailable ?? true,
      isFeatured: defaultValues?.isFeatured ?? false,
      isHighlight: defaultValues?.isHighlight ?? false,
      displayOrder: defaultValues?.displayOrder ?? 0,
      relatedProductIds: defaultValues?.relatedProductIds ?? [],
      metaDescription: defaultValues?.metaDescription ?? "",
      metaKeywords: defaultValues?.metaKeywords ?? [],
    }),
    [defaultValues],
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initial,
  });

  useEffect(() => {
    form.reset(initial);
  }, [initial, form]);

  // Auto-generate slug from title if slug is empty
  const titleVal = form.watch("title");
  useEffect(() => {
    const current = form.getValues("slug");
    if (!current && titleVal) {
      form.setValue("slug", slugify(titleVal));
    }
  }, [titleVal, form]);

  const categoryId = form.watch("categoryId");
  const selectedCategory = categories?.find((c) => c._id === categoryId);
  const subcategories = selectedCategory?.subcategories ?? [];

  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");
  const specs = form.watch("specifications") ?? {};

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Title *</Label>
                <Input {...form.register("title")} />
                {form.formState.errors.title && (
                  <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Item Number *</Label>
                <Input {...form.register("itemNumber")} />
                {form.formState.errors.itemNumber && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.itemNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Product Type *</Label>
                <Controller
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="antique">Antique</SelectItem>
                        <SelectItem value="jewelry">Jewelry</SelectItem>
                        <SelectItem value="coin">Coin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category *</Label>
                <Controller
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.categoryId && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.categoryId.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Subcategory</Label>
                <Controller
                  control={form.control}
                  name="subcategoryId"
                  render={({ field }) => (
                    <Select
                      value={field.value || "none"}
                      onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
                      disabled={subcategories.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {subcategories.map((s) => (
                          <SelectItem key={s._id} value={s._id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Description *</Label>
                <Textarea rows={5} {...form.register("description")} />
                {form.formState.errors.description && (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Price (NGN) *</Label>
              <Input type="number" step="1" {...form.register("price")} />
            </div>
            <div className="space-y-1.5">
              <Label>Price Display Override</Label>
              <Input placeholder='e.g. "On Request"' {...form.register("priceDisplay")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={form.control}
              name="images"
              render={({ field }) => (
                <ImageUploader
                  value={field.value ?? []}
                  onChange={field.onChange}
                  folder="products"
                />
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(specs).map(([k, v]) => (
              <div
                key={k}
                className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
              >
                <span className="font-medium">{k}:</span>
                <span className="flex-1 text-muted-foreground">{v}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    const next = { ...specs };
                    delete next[k];
                    form.setValue("specifications", next);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="Key (e.g. Material)"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
              />
              <Input
                placeholder="Value (e.g. Gold)"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (!specKey.trim()) return;
                  form.setValue("specifications", { ...specs, [specKey]: specValue });
                  setSpecKey("");
                  setSpecValue("");
                }}
              >
                <Plus className="mr-1 h-4 w-4" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input {...form.register("slug")} />
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
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Available</Label>
              <Controller
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Featured</Label>
              <Controller
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Highlight</Label>
              <Controller
                control={form.control}
                name="isHighlight"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Display Order</Label>
              <Input type="number" {...form.register("displayOrder")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Era</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Age Range</Label>
              <Controller
                control={form.control}
                name="ageRangeId"
                render={({ field }) => (
                  <Select
                    value={field.value || "none"}
                    onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {ageRanges?.map((a) => (
                        <SelectItem key={a._id} value={a._id}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Year Start</Label>
                <Input type="number" {...form.register("yearEstimate.startYear")} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Year End</Label>
                <Input type="number" {...form.register("yearEstimate.endYear")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
