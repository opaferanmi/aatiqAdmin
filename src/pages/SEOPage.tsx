import { Link } from "@tanstack/react-router";
import { Globe, FileText, Package, FolderTree, Map, ArrowRightLeft } from "lucide-react";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

const TILES = [
  {
    to: "/dashboard/seo/global",
    title: "Global SEO",
    icon: Globe,
    desc: "Site-wide meta and OG defaults",
  },
  {
    to: "/dashboard/seo/pages",
    title: "Page SEO",
    icon: FileText,
    desc: "Per-page SEO configuration",
  },
  {
    to: "/dashboard/seo/products",
    title: "Product SEO",
    icon: Package,
    desc: "Per-product SEO overrides",
  },
  {
    to: "/dashboard/seo/categories",
    title: "Category SEO",
    icon: FolderTree,
    desc: "Per-category SEO overrides",
  },
  {
    to: "/dashboard/seo/sitemap",
    title: "Sitemap",
    icon: Map,
    desc: "Generate and manage sitemap.xml",
  },
  {
    to: "/dashboard/seo/redirects",
    title: "Redirects",
    icon: ArrowRightLeft,
    desc: "301/302 URL redirects",
  },
] as const;

export function SEOPage() {
  return (
    <div>
      <PageHeader title="SEO" description="Manage everything search engines see" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to}>
              <Card className="h-full transition hover:border-primary/50 hover:shadow-sm">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{t.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
