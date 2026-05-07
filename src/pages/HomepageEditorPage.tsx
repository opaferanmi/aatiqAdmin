import { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { useHomepage, useUpdateHomepage } from "@/lib/hooks/useContent";
import { useProducts } from "@/lib/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { LoadingSpinner } from "@/components/ui-extras/LoadingSpinner";
import { SingleImageUploader } from "@/components/ui-extras/ImageUploader";
import type { HomepageContent } from "@/types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

export function HomepageEditorPage() {
  const { data, isLoading } = useHomepage();
  const update = useUpdateHomepage();
  const products = useProducts({ page: 1, limit: 100 });

  const form = useForm<HomepageContent>({
    defaultValues: { heroSlideshow: [], sections: [], featuredProductIds: [], ctaButtons: [] },
  });

  useEffect(() => {
    if (data) form.reset(data);
  }, [data, form]);

  const slides = useFieldArray({ control: form.control, name: "heroSlideshow" });
  const sections = useFieldArray({ control: form.control, name: "sections" });
  const ctas = useFieldArray({ control: form.control, name: "ctaButtons" });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Homepage Editor" description="Edit the homepage of the customer site" />
      <form
        onSubmit={form.handleSubmit(async (v) => {
          try {
            await update.mutateAsync(v);
            toast.success("Homepage saved");
          } catch (e) {
            toast.error(getApiErrorMessage(e));
          }
        })}
        className="space-y-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Hero Slideshow</CardTitle>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                slides.append({
                  image: "",
                  title: "",
                  subtitle: "",
                  displayOrder: slides.fields.length,
                })
              }
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Slide
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {slides.fields.map((field, idx) => (
              <div key={field.id} className="rounded-md border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <GripVertical className="h-4 w-4 text-muted-foreground" /> Slide {idx + 1}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => slides.remove(idx)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Image</Label>
                    <Controller
                      control={form.control}
                      name={`heroSlideshow.${idx}.image`}
                      render={({ field: f }) => (
                        <SingleImageUploader
                          value={f.value}
                          onChange={f.onChange}
                          folder="homepage"
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Title</Label>
                    <Input {...form.register(`heroSlideshow.${idx}.title`)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Subtitle</Label>
                    <Input {...form.register(`heroSlideshow.${idx}.subtitle`)} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Sections</CardTitle>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                sections.append({
                  title: "",
                  subtitle: "",
                  description: "",
                  image: "",
                  content: "",
                  sectionType: "featured",
                  displayOrder: sections.fields.length,
                  isVisible: true,
                })
              }
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Section
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {sections.fields.map((field, idx) => (
              <div key={field.id} className="rounded-md border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium">Section {idx + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => sections.remove(idx)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Title</Label>
                    <Input {...form.register(`sections.${idx}.title`)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Controller
                      control={form.control}
                      name={`sections.${idx}.sectionType`}
                      render={({ field: f }) => (
                        <Select value={f.value} onValueChange={f.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "featured",
                              "story",
                              "acquired",
                              "treasures",
                              "collections",
                              "highlights",
                            ].map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Subtitle</Label>
                    <Input {...form.register(`sections.${idx}.subtitle`)} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Description</Label>
                    <Textarea rows={2} {...form.register(`sections.${idx}.description`)} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Content (HTML)</Label>
                    <Textarea rows={4} {...form.register(`sections.${idx}.content`)} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Image</Label>
                    <Controller
                      control={form.control}
                      name={`sections.${idx}.image`}
                      render={({ field: f }) => (
                        <SingleImageUploader
                          value={f.value}
                          onChange={f.onChange}
                          folder="homepage"
                        />
                      )}
                    />
                  </div>
                  <div className="flex items-center justify-between sm:col-span-2">
                    <Label>Visible</Label>
                    <Controller
                      control={form.control}
                      name={`sections.${idx}.isVisible`}
                      render={({ field: f }) => (
                        <Switch checked={f.value} onCheckedChange={f.onChange} />
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">CTA Buttons</CardTitle>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => ctas.append({ text: "", url: "", style: "primary" })}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add CTA
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {ctas.fields.map((field, idx) => (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto_auto]"
              >
                <Input placeholder="Text" {...form.register(`ctaButtons.${idx}.text`)} />
                <Input placeholder="URL" {...form.register(`ctaButtons.${idx}.url`)} />
                <Controller
                  control={form.control}
                  name={`ctaButtons.${idx}.style`}
                  render={({ field: f }) => (
                    <Select value={f.value} onValueChange={f.onChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => ctas.remove(idx)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Featured Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={form.control}
              name="featuredProductIds"
              render={({ field }) => (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {products.data?.data?.map((p) => {
                    const checked = field.value?.includes(p._id);
                    return (
                      <label
                        key={p._id}
                        className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-2 text-sm hover:bg-muted/50"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const list = field.value ?? [];
                            field.onChange(
                              e.target.checked
                                ? [...list, p._id]
                                : list.filter((id) => id !== p._id),
                            );
                          }}
                        />
                        <span className="truncate">{p.title}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" disabled={update.isPending}>
          {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Homepage
        </Button>
      </form>
    </div>
  );
}
