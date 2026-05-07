import { Loader2, Map, ExternalLink } from "lucide-react";
import { useGenerateSitemap } from "@/lib/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import { useState } from "react";

export function SitemapPage() {
  const generate = useGenerateSitemap();
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  return (
    <div>
      <PageHeader title="Sitemap" description="Generate and access your XML sitemap" />
      <Card>
        <CardContent className="flex flex-col items-start gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Map className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Generate sitemap.xml</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Crawl all your products, categories, and pages and rebuild the sitemap.
            </p>
          </div>
          <Button
            disabled={generate.isPending}
            onClick={async () => {
              try {
                const res = await generate.mutateAsync();
                setLastUrl(res.sitemapUrl);
                toast.success(res.message ?? "Sitemap generated");
              } catch (e) {
                toast.error(getApiErrorMessage(e));
              }
            }}
          >
            {generate.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Sitemap Now
          </Button>
          {lastUrl && (
            <a
              href={lastUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              {lastUrl} <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
