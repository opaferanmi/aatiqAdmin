import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  useAdminUsers,
  useCreateAdminUser,
  useUpdateAdminUser,
  useDeleteAdminUser,
} from "@/lib/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { EmptyState } from "@/components/ui-extras/EmptyState";
import { ConfirmDialog } from "@/components/ui-extras/ConfirmDialog";
import { LoadingSpinner } from "@/components/ui-extras/LoadingSpinner";
import { adminUserSchema, type AdminUserFormValues } from "@/lib/validations/settingsSchema";
import { usePermission } from "@/lib/utils/permissions";
import { formatDateTime } from "@/lib/utils/formatters";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import type { Admin } from "@/types";

export function AdminUsersPage() {
  const { isSuperAdmin } = usePermission();
  const { data, isLoading } = useAdminUsers();
  const create = useCreateAdminUser();
  const remove = useDeleteAdminUser();
  const [editing, setEditing] = useState<Admin | null>(null);
  const [creating, setCreating] = useState(false);

  if (!isSuperAdmin()) {
    return (
      <div>
        <PageHeader title="Admin Users" />
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Only superadmins can manage admin users.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Admin Users"
        description="Manage who can access this dashboard"
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Admin
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.length ?? 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <EmptyState title="No admin users yet" />
                    </TableCell>
                  </TableRow>
                )}
                {data?.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">
                      {u.firstName} {u.lastName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{u.role.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.isActive ? "default" : "secondary"}>
                        {u.isActive ? "Active" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(u.lastLogin)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(u)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          }
                          title="Delete admin?"
                          destructive
                          onConfirm={async () => {
                            try {
                              await remove.mutateAsync(u.id);
                              toast.success("Deleted");
                            } catch (e) {
                              toast.error(getApiErrorMessage(e));
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <AdminSheet
        open={creating || !!editing}
        onOpenChange={(o) => {
          if (!o) {
            setCreating(false);
            setEditing(null);
          }
        }}
        initial={editing ?? undefined}
        onCreate={async (v) => {
          try {
            await create.mutateAsync({ ...v, password: v.password ?? "" });
            toast.success("Admin created");
            setCreating(false);
          } catch (e) {
            toast.error(getApiErrorMessage(e));
          }
        }}
      />
    </div>
  );
}

function AdminSheet({
  open,
  onOpenChange,
  initial,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial?: Admin;
  onCreate: (values: AdminUserFormValues) => Promise<void>;
}) {
  const update = useUpdateAdminUser(initial?.id ?? "");
  const form = useForm<AdminUserFormValues>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      role: "admin",
      isActive: true,
    },
  });

  useEffect(() => {
    form.reset({
      firstName: initial?.firstName ?? "",
      lastName: initial?.lastName ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      password: "",
      role: initial?.role ?? "admin",
      isActive: initial?.isActive ?? true,
    });
  }, [initial, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{initial ? "Edit Admin" : "New Admin"}</SheetTitle>
        </SheetHeader>
        <form
          onSubmit={form.handleSubmit(async (v) => {
            if (initial) {
              try {
                const payload = { ...v };
                if (!payload.password) delete payload.password;
                await update.mutateAsync(payload);
                toast.success("Updated");
                onOpenChange(false);
              } catch (e) {
                toast.error(getApiErrorMessage(e));
              }
            } else {
              await onCreate(v);
            }
          })}
          className="space-y-4 px-4 py-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>First Name *</Label>
              <Input {...form.register("firstName")} />
            </div>
            <div className="space-y-1.5">
              <Label>Last Name *</Label>
              <Input {...form.register("lastName")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Email *</Label>
            <Input type="email" {...form.register("email")} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input {...form.register("phone")} />
          </div>
          <div className="space-y-1.5">
            <Label>{initial ? "New Password (leave blank to keep)" : "Password *"}</Label>
            <Input type="password" {...form.register("password")} />
          </div>
          <div className="space-y-1.5">
            <Label>Role *</Label>
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superadmin">Superadmin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="content_manager">Content Manager</SelectItem>
                    <SelectItem value="seo_manager">SEO Manager</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Controller
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
          <SheetFooter>
            <Button type="submit" disabled={form.formState.isSubmitting || update.isPending}>
              {(form.formState.isSubmitting || update.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {initial ? "Save" : "Create"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
