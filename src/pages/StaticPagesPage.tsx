import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

const PAGES = [
  { slug: "about", title: "About" },
  { slug: "terms", title: "Terms of Service" },
  { slug: "privacy", title: "Privacy Policy" },
  { slug: "contact", title: "Contact" },
];

export function StaticPagesPage() {
  return (
    <div>
      <PageHeader title="Static Pages" description="Edit your site's static content pages" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PAGES.map((p) => (
          <Link key={p.slug} to="/dashboard/content/pages/$slug" params={{ slug: p.slug }}>
            <Card className="transition hover:border-primary/50 hover:shadow-sm">
              <CardContent className="flex items-center gap-3 p-5">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">/{p.slug}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
