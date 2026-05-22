import { Link } from "@tanstack/react-router";
import { Home, FileText } from "lucide-react";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export function ContentPage() {
  const tiles = [
    // {
    //   to: "/dashboard/content/homepage",
    //   title: "Homepage Editor",
    //   desc: "Hero, sections, CTAs",
    //   icon: Home,
    // },
    {
      to: "/dashboard/content/pages",
      title: "Static Pages",
      desc: "About, Terms, Privacy, Contact",
      icon: FileText,
    },
  ] as const;
  return (
    <div>
      <PageHeader title="Content" description="Manage your website content" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tiles.map((t) => {
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
