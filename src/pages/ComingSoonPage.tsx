import { type ReactNode } from "react";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export function ComingSoonPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <Card>
        <CardContent className="p-8 text-sm text-muted-foreground">
          {children ?? (
            <>
              This page is scaffolded and wired to your live API. Full UI is being delivered in the
              next iteration. The endpoints are already implemented in{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">src/lib/api/</code> and ready
              to use.
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
