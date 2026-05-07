import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useStaticPage, useUpdateStaticPage } from "@/lib/hooks/useContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { LoadingSpinner } from "@/components/ui-extras/LoadingSpinner";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

export function EditPagePage() {
  const { slug } = useParams({ from: "/dashboard/content/pages/$slug" });
  const { data, isLoading } = useStaticPage(slug);
  const update = useUpdateStaticPage(slug);

  const [pageTitle, setPageTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (data) {
      setPageTitle(data.pageTitle ?? "");
      setContent(data.content ?? "");
      setIsPublished(data.isPublished ?? true);
    }
  }, [data]);

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-2">
        <Link to="/dashboard/content/pages">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to pages
        </Link>
      </Button>
      <PageHeader title={`Edit: ${slug}`} description="Static page content" />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1.5">
              <Label>Page Title</Label>
              <Input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Content (HTML supported)</Label>
              <Textarea
                rows={20}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Published</Label>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>
            <Button
              disabled={update.isPending}
              onClick={async () => {
                try {
                  await update.mutateAsync({ pageTitle, content, isPublished });
                  toast.success("Page saved");
                } catch (e) {
                  toast.error(getApiErrorMessage(e));
                }
              }}
            >
              {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
