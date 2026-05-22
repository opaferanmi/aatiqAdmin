import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useGlobalSeo, useUpdateGlobalSeo } from "@/lib/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { LoadingSpinner } from "@/components/ui-extras/LoadingSpinner";
import { TagInput } from "@/components/ui-extras/TagInput";
import { SingleImageUploader } from "@/components/ui-extras/ImageUploader";
import { globalSeoSchema, type GlobalSeoFormValues } from "@/lib/validations/seoSchema";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

export function GlobalSEOPage() {
  const { data, isLoading } = useGlobalSeo();
  const update = useUpdateGlobalSeo();

  const form = useForm<GlobalSeoFormValues>({
    resolver: zodResolver(globalSeoSchema),
    defaultValues: {
      siteTitle: "",
      siteDescription: "",
      siteKeywords: [],
      siteAuthor: "",
      siteLanguage: "en",
      baseUrl: "",
      ogImage: "",
      ogTitle: "",
      ogDescription: "",
      twitterHandle: "",
      googleAnalyticsId: "",
      googleSearchConsoleId: "",
      enableSitemap: true,
      enableRobotsTxt: true,
      indexingEnabled: true,
    },
  });

  useEffect(() => {
    if (data) form.reset(data as GlobalSeoFormValues);
  }, [data, form]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Global SEO" description="Site-wide defaults for meta tags" />
      <form
        onSubmit={form.handleSubmit(async (v) => {
          try {
            await update.mutateAsync(v);
            toast.success("Saved");
          } catch (e) {
            toast.error(getApiErrorMessage(e));
          }
        })}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Site Identity</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Site Title *</Label>
              <Input {...form.register("siteTitle")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Site Description *</Label>
              <Textarea rows={3} {...form.register("siteDescription")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Site Keywords</Label>
              <Controller
                control={form.control}
                name="siteKeywords"
                render={({ field }) => (
                  <TagInput value={field.value ?? []} onChange={field.onChange} />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Author</Label>
              <Input {...form.register("siteAuthor")} />
            </div>
            <div className="space-y-1.5">
              <Label>Language</Label>
              <Input {...form.register("siteLanguage")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Base URL *</Label>
              <Input {...form.register("baseUrl")} placeholder="https://antiques.com" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Open Graph & Twitter</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>OG Image</Label>
              <Controller
                control={form.control}
                name="ogImage"
                render={({ field }) => (
                  <SingleImageUploader value={field.value} onChange={field.onChange} folder="seo" />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>OG Title</Label>
              <Input {...form.register("ogTitle")} />
            </div>
            <div className="space-y-1.5">
              <Label>Twitter Handle</Label>
              <Input {...form.register("twitterHandle")} placeholder="@antiques" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>OG Description</Label>
              <Textarea rows={2} {...form.register("ogDescription")} />
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle className="text-base">Analytics & Indexing</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Google Analytics ID</Label>
              <Input {...form.register("googleAnalyticsId")} placeholder="G-XXXXXXX" />
            </div>
            <div className="space-y-1.5">
              <Label>Search Console ID</Label>
              <Input {...form.register("googleSearchConsoleId")} />
            </div>
            <div className="flex items-center justify-between sm:col-span-2">
              <Label>Enable Sitemap</Label>
              <Controller
                control={form.control}
                name="enableSitemap"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
            <div className="flex items-center justify-between sm:col-span-2">
              <Label>Enable robots.txt</Label>
              <Controller
                control={form.control}
                name="enableRobotsTxt"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
            <div className="flex items-center justify-between sm:col-span-2">
              <Label>Indexing Enabled</Label>
              <Controller
                control={form.control}
                name="indexingEnabled"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          </CardContent>
        </Card> 
        */}

        <Button type="submit" disabled={update.isPending}>
          {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save SEO Settings
        </Button>
      </form>
    </div>
  );
}
