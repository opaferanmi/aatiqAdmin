import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useEnquiry, useUpdateEnquiryStatus, useDeleteEnquiry } from "@/lib/hooks/useEnquiries";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { LoadingSpinner } from "@/components/ui-extras/LoadingSpinner";
import { ConfirmDialog } from "@/components/ui-extras/ConfirmDialog";
import { ADMIN_PERMISSIONS, usePermission } from "@/lib/utils/permissions";
import { formatDateTime } from "@/lib/utils/formatters";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import type { EnquiryStatus } from "@/types";

export function EnquiryDetailPage() {
  const { id } = useParams({ from: "/dashboard/enquiries/$id" });
  const navigate = useNavigate();
  const { can } = usePermission();
  const { data, isLoading } = useEnquiry(id);
  const updateStatus = useUpdateEnquiryStatus(id);
  const remove = useDeleteEnquiry();

  const [status, setStatus] = useState<EnquiryStatus>("new");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (data) {
      setStatus(data.status);
      setNotes(data.adminNotes ?? "");
    }
  }, [data]);

  if (isLoading || !data) return <LoadingSpinner />;

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-2">
        <Link to="/dashboard/enquiries">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to enquiries
        </Link>
      </Button>
      <PageHeader
        title={`${data.firstName} ${data.lastName}`}
        description={data.email}
        actions={
          can(ADMIN_PERMISSIONS.DELETE_ENQUIRY) && (
            <ConfirmDialog
              trigger={
                <Button variant="outline" className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              }
              title="Delete this enquiry?"
              destructive
              onConfirm={async () => {
                try {
                  await remove.mutateAsync(id);
                  toast.success("Deleted");
                  navigate({ to: "/dashboard/enquiries" });
                } catch (e) {
                  toast.error(getApiErrorMessage(e));
                }
              }}
            />
          )
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{data.message}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p>{data.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p>{data.phone ?? "—"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-muted-foreground">Address</p>
                <p>{data.address ?? "—"}</p>
              </div>
            </CardContent>
          </Card>

          {data.productTitle && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Product</CardTitle>
              </CardHeader>
              <CardContent>
                {data.productId ? (
                  <Link
                    to="/dashboard/products/$id"
                    params={{ id: data.productId }}
                    className="text-sm text-primary hover:underline"
                  >
                    {data.productTitle}
                  </Link>
                ) : (
                  <p className="text-sm">{data.productTitle}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge>{data.status}</Badge>
              <div className="space-y-1.5">
                <Label>Update status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as EnquiryStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Admin notes</Label>
                <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <Button
                className="w-full"
                disabled={updateStatus.isPending}
                onClick={async () => {
                  try {
                    await updateStatus.mutateAsync({ status, adminNotes: notes });
                    toast.success("Updated");
                  } catch (e) {
                    toast.error(getApiErrorMessage(e));
                  }
                }}
              >
                {updateStatus.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>Received: {formatDateTime(data.createdAt)}</p>
              {data.respondedAt && <p>Responded: {formatDateTime(data.respondedAt)}</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
