import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useRedirects, useCreateRedirect, useDeleteRedirect } from "@/lib/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { ConfirmDialog } from "@/components/ui-extras/ConfirmDialog";
import { EmptyState } from "@/components/ui-extras/EmptyState";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

export function RedirectsPage() {
  const { data, isLoading } = useRedirects();
  const create = useCreateRedirect();
  const remove = useDeleteRedirect();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState<"301" | "302">("301");

  const handleCreate = async () => {
    if (!from || !to) {
      toast.error("Both URLs are required");
      return;
    }
    try {
      await create.mutateAsync({ fromUrl: from, toUrl: to, type });
      toast.success("Redirect added");
      setFrom("");
      setTo("");
    } catch (e) {
      toast.error(getApiErrorMessage(e));
    }
  };

  return (
    <div>
      <PageHeader title="Redirects" description="Manage 301 and 302 URL redirects" />

      <Card className="mb-4">
        <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-[1fr_1fr_auto_auto]">
          <div className="space-y-1">
            <Label className="text-xs">From URL</Label>
            <Input placeholder="/old-page" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">To URL</Label>
            <Input placeholder="/new-page" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as "301" | "302")}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="301">301</SelectItem>
                <SelectItem value="302">302</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleCreate} disabled={create.isPending}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="p-6 text-sm text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && (data?.length ?? 0) === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="p-0">
                    <EmptyState title="No redirects configured" />
                  </TableCell>
                </TableRow>
              )}
              {data?.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="font-mono text-xs">{r.fromUrl}</TableCell>
                  <TableCell className="font-mono text-xs">{r.toUrl}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{r.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.isActive ? "default" : "secondary"}>
                      {r.isActive ? "Active" : "Off"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      }
                      title="Delete redirect?"
                      destructive
                      onConfirm={async () => {
                        try {
                          await remove.mutateAsync(r._id);
                          toast.success("Deleted");
                        } catch (e) {
                          toast.error(getApiErrorMessage(e));
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
