import { useRef, useState } from "react";
import { Loader2, Upload, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/lib/api/cloudinary";
import { toast } from "sonner";
import type { ProductImage } from "@/types";

export function ImageUploader({
  value,
  onChange,
  folder,
  multiple = true,
}: {
  value: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  folder?: string;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const uploaded: ProductImage[] = [];
      for (const file of Array.from(files)) {
        const { url } = await uploadToCloudinary(file, folder);
        uploaded.push({
          url,
          caption: "",
          isPrimary: false,
          displayOrder: value.length + uploaded.length,
        });
      }
      const merged = multiple ? [...value, ...uploaded] : uploaded;
      // Ensure one primary
      if (!merged.some((m) => m.isPrimary) && merged.length > 0) {
        merged[0].isPrimary = true;
      }
      onChange(merged);
      toast.success(`${uploaded.length} image(s) uploaded`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const setPrimary = (idx: number) => {
    onChange(value.map((img, i) => ({ ...img, isPrimary: i === idx })));
  };

  const remove = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    if (!next.some((m) => m.isPrimary) && next.length > 0) next[0].isPrimary = true;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {value.map((img, idx) => (
          <div
            key={img.url + idx}
            className="group relative h-24 w-24 overflow-hidden rounded-md border border-border bg-muted"
          >
            <img src={img.url} alt={img.caption ?? ""} className="h-full w-full object-cover" />
            {img.isPrimary && (
              <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                Primary
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
              {!img.isPrimary && (
                <button
                  type="button"
                  onClick={() => setPrimary(idx)}
                  className="rounded bg-background/90 p-1 hover:bg-background"
                  aria-label="Set as primary"
                >
                  <Star className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="rounded bg-destructive/90 p-1 text-destructive-foreground hover:bg-destructive"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <span>Upload</span>
            </>
          )}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-muted-foreground">
        Click an image to set as primary. Uploads use Cloudinary signed signatures from your
        backend.
      </p>
    </div>
  );
}

export function SingleImageUploader({
  value,
  onChange,
  folder,
}: {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await uploadToCloudinary(file, folder);
      onChange(url);
      toast.success("Uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className="relative h-20 w-20 overflow-hidden rounded-md border border-border">
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1 top-1 rounded bg-destructive/90 p-0.5 text-destructive-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? (
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
        ) : (
          <Upload className="mr-2 h-3.5 w-3.5" />
        )}
        {value ? "Replace" : "Upload"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
