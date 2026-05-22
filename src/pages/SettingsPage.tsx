import { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useSiteSettings, useUpdateSiteSettings } from "@/lib/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { LoadingSpinner } from "@/components/ui-extras/LoadingSpinner";
import { SingleImageUploader } from "@/components/ui-extras/ImageUploader";
import { settingsSchema, type SettingsFormValues } from "@/lib/validations/settingsSchema";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function SettingsPage() {
  const { data, isLoading } = useSiteSettings();
  const update = useUpdateSiteSettings();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      businessName: "",
      email: "",
      phone: "",
      address: "",
      socialLinks: [],
      businessHours: DAYS.map((day) => ({
        day,
        openTime: "09:00",
        closeTime: "17:00",
        isClosed: false,
      })),
    },
  });

  useEffect(() => {
    if (data) form.reset(data as SettingsFormValues);
  }, [data, form]);

  const social = useFieldArray({ control: form.control, name: "socialLinks" });
  const hours = useFieldArray({ control: form.control, name: "businessHours" });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Settings" description="Business and site-wide settings" />
      <form
        onSubmit={form.handleSubmit(async (v) => {
          try {
            await update.mutateAsync(v as Parameters<typeof update.mutateAsync>[0]);
            toast.success("Saved");
          } catch (e) {
            toast.error(getApiErrorMessage(e));
          }
        })}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Business</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Business Name *</Label>
              <Input {...form.register("businessName")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Description</Label>
              <Textarea rows={3} {...form.register("businessDescription")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" {...form.register("email")} />
            </div>
            <div className="space-y-1.5">
              <Label>Phone *</Label>
              <Input {...form.register("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label>Alt Phone</Label>
              <Input {...form.register("alternatePhone")} />
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input {...form.register("city")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Address *</Label>
              <Input {...form.register("address")} />
            </div>
            <div className="space-y-1.5">
              <Label>Country</Label>
              <Input {...form.register("country")} />
            </div>
            <div className="space-y-1.5">
              <Label>Zip / Postal Code</Label>
              <Input {...form.register("zipCode")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Support</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Support Email</Label>
              <Input type="email" {...form.register("supportEmail")} />
            </div>
            <div className="space-y-1.5">
              <Label>Support Phone</Label>
              <Input {...form.register("supportPhone")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Support Hours</Label>
              <Input {...form.register("supportHours")} placeholder="Mon-Fri 9am-5pm" />
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Social Links</CardTitle>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => social.append({ platform: "instagram", url: "" })}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {social.fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-[140px_1fr_auto] gap-2">
                <Controller
                  control={form.control}
                  name={`socialLinks.${idx}.platform`}
                  render={({ field: f }) => (
                    <Select value={f.value} onValueChange={f.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["instagram", "facebook", "twitter", "linkedin", "youtube"].map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input placeholder="https://..." {...form.register(`socialLinks.${idx}.url`)} />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => social.remove(idx)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card> */}
        {/* 
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Business Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {hours.fields.map((field, idx) => (
              <div
                key={field.id}
                className="grid grid-cols-[100px_1fr_1fr_auto] items-center gap-2 text-sm"
              >
                <span className="font-medium">{form.getValues(`businessHours.${idx}.day`)}</span>
                <Input type="time" {...form.register(`businessHours.${idx}.openTime`)} />
                <Input type="time" {...form.register(`businessHours.${idx}.closeTime`)} />
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Closed</Label>
                  <Controller
                    control={form.control}
                    name={`businessHours.${idx}.isClosed`}
                    render={({ field: f }) => (
                      <Switch checked={f.value} onCheckedChange={f.onChange} />
                    )}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Branding</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Logo</Label>
              <Controller
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <SingleImageUploader
                    value={field.value}
                    onChange={field.onChange}
                    folder="branding"
                  />
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Favicon</Label>
              <Controller
                control={form.control}
                name="faviconUrl"
                render={({ field }) => (
                  <SingleImageUploader
                    value={field.value}
                    onChange={field.onChange}
                    folder="branding"
                  />
                )}
              />
            </div>
          </CardContent>
        </Card> */}

        <Button type="submit" disabled={update.isPending}>
          {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </form>
    </div>
  );
}
