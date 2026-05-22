import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, Trash2, FileDown, Inbox } from "lucide-react";
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
import { formatDate } from "@/lib/utils/formatters";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import { Consignment, consignmentsApi } from "@/lib/api/consignment";
import { useConsignments, useDeleteConsignment } from "@/lib/hooks/Useconsignments";

type ConsignmentStatus = Consignment["status"];

const STATUS_BADGE: Record<ConsignmentStatus, "default" | "secondary" | "outline" | "destructive"> =
  {
    new: "default",
    reviewed: "secondary",
    offered: "outline",
    accepted: "default",
    declined: "destructive",
  };

export function ConsignmentsPage() {
  const [status, setStatus] = useState<ConsignmentStatus | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useConsignments({
    status: status === "all" ? undefined : status,
    page,
    limit: 20,
  });

  const remove = useDeleteConsignment();

  const handleExport = async () => {
    try {
      const blob = await consignmentsApi.exportDownload("csv");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `consignments-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Exported successfully");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  // FIX: Added optional chaining throughout to prevent undefined runtime errors
  const rows = data?.data?.data ?? [];
  const pagination = data?.data?.pagination ?? {};

  return (
    <div>
      <PageHeader
        title="Consignments"
        description="Manage customer consignment submissions"
        actions={
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <Tabs
        value={status}
        onValueChange={(v) => {
          setStatus(v as ConsignmentStatus | "all");
          setPage(1);
        }}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
          <TabsTrigger value="offered">Offered</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="declined">Declined</TabsTrigger>
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
                  <TableHead>Item</TableHead>
                  <TableHead>Images</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}

                {/* FIX: Removed the duplicated empty-state row block */}
                {!isLoading && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="p-0">
                      <EmptyState title="No consignments" icon={<Inbox className="h-6 w-6" />} />
                    </TableCell>
                  </TableRow>
                )}

                {rows.length > 0 &&
                  rows.map((c: any) => (
                    <TableRow key={c._id}>
                      <TableCell className="font-medium">
                        {c.firstName} {c.lastName}
                      </TableCell>
                      <TableCell className="text-sm text-foreground/70">{c.email}</TableCell>
                      <TableCell className="text-sm max-w-xs truncate">
                        {c.itemTitle ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {c.images?.length ?? 0} {(c.images?.length ?? 0) === 1 ? "image" : "images"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={STATUS_BADGE[c.status as keyof typeof STATUS_BADGE] ?? "outline"}
                        >
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground/70">
                        {formatDate(c.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to="/dashboard/consignments/$id" params={{ id: c._id }}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <ConfirmDialog
                            trigger={
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            }
                            title="Delete consignment?"
                            destructive
                            onConfirm={async () => {
                              try {
                                await remove.mutateAsync(c._id);
                                toast.success("Deleted");
                              } catch (err) {
                                toast.error(getApiErrorMessage(err));
                              }
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border p-4 text-sm">
              <span className="text-foreground/60">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
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
