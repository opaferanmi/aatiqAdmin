import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, Trash2, Download, Inbox } from "lucide-react";
import { useEnquiries, useDeleteEnquiry } from "@/lib/hooks/useEnquiries";
import { enquiriesApi } from "@/lib/api/enquiries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { EmptyState } from "@/components/ui-extras/EmptyState";
import { ConfirmDialog } from "@/components/ui-extras/ConfirmDialog";
import { ADMIN_PERMISSIONS, usePermission } from "@/lib/utils/permissions";
import { formatDate } from "@/lib/utils/formatters";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import type { EnquiryStatus } from "@/types";

export function EnquiriesPage() {
  const { can } = usePermission();
  const [status, setStatus] = useState<EnquiryStatus | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useEnquiries({
    status: status === "all" ? undefined : status,
    page,
    limit: 20,
  });
  const remove = useDeleteEnquiry();

  const handleExport = async () => {
    try {
      const blob = await enquiriesApi.exportDownload("csv");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `enquiries-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  return (
    <div>
      <PageHeader
        title="Enquiries"
        description="Customer enquiries about your products"
        actions={
          can(ADMIN_PERMISSIONS.EXPORT_ENQUIRIES) && (
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          )
        }
      />

      <Tabs
        value={status}
        onValueChange={(v) => {
          setStatus(v as EnquiryStatus | "all");
          setPage(1);
        }}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoading && (data?.data?.length ?? 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <EmptyState title="No enquiries" icon={<Inbox className="h-6 w-6" />} />
                    </TableCell>
                  </TableRow>
                )}
                {data?.data?.map((e) => (
                  <TableRow key={e._id} className={!e.isRead ? "bg-primary/5" : ""}>
                    <TableCell className="font-medium">
                      {e.firstName} {e.lastName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{e.email}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm">
                      {e.productTitle ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          e.status === "new"
                            ? "default"
                            : e.status === "contacted"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {e.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(e.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to="/dashboard/enquiries/$id" params={{ id: e._id }}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {can(ADMIN_PERMISSIONS.DELETE_ENQUIRY) && (
                          <ConfirmDialog
                            trigger={
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            }
                            title="Delete enquiry?"
                            destructive
                            onConfirm={async () => {
                              try {
                                await remove.mutateAsync(e._id);
                                toast.success("Deleted");
                              } catch (err) {
                                toast.error(getApiErrorMessage(err));
                              }
                            }}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border p-4 text-sm">
              <span className="text-muted-foreground">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.pagination.hasPrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!data.pagination.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
