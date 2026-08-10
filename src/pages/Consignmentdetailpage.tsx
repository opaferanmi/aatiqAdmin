import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import { formatDateTime } from "@/lib/utils/formatters";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import { Consignment } from "@/lib/api/consignment";
import {
  useConsignment,
  useUpdateConsignmentStatus,
  useDeleteConsignment,
} from "@/lib/hooks/Useconsignments";

type ConsignmentStatus = Consignment["status"];

export function ConsignmentDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();

  const { data, isLoading } = useConsignment(id);
  const updateStatus = useUpdateConsignmentStatus(id);
  const remove = useDeleteConsignment();

  const [status, setStatus] = useState<ConsignmentStatus>("new");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);


  useEffect(() => {
    if (data) setStatus(data.status);
  }, [data]);

  if (isLoading || !data) return <LoadingSpinner />;

  const images = data.images ?? [];

  const handleDownloadImages = () => {
    images.forEach((img: any, idx: number) => {
      const a = document.createElement("a");
      a.href = img.url;
      a.download = `${data.firstName}-${data.lastName}-${idx + 1}.jpg`;
      a.click();
    });
    toast.success("Download started");
  };

  const handleUpdateStatus = async () => {
    try {
      await updateStatus.mutateAsync({ status });
      toast.success("Status updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(id);
      toast.success("Deleted");
      navigate({ to: "/dashboard/consignments" as any });
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-2">
        <Link to={"/dashboard/consignments" as any}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to consignments
        </Link>
      </Button>

      <PageHeader
        title={`${data.firstName} ${data.lastName}`}
        description={data.email}
        actions={
          <ConfirmDialog
            trigger={
              <Button variant="outline" className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            }
            title="Delete this consignment?"
            destructive
            onConfirm={handleDelete}
          />
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Images */}
          {images.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Images ({images.length})</CardTitle>
                <Button size="sm" variant="outline" onClick={handleDownloadImages}>
                  Download All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img: any, idx: any) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className="group relative aspect-square overflow-hidden rounded-sm bg-muted ring-1 ring-border hover:ring-[#C6A96B] transition-all"
                    >
                      <img
                        src={img.url}
                        alt={`Item ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <span className="text-white text-xs font-mono opacity-0 group-hover:opacity-100">
                          Click to expand
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{data.description}</p>
            </CardContent>
          </Card>

          {/* Item details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Item Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {data.itemTitle && <DetailField label="Title" value={data.itemTitle} />}
                {data.category && <DetailField label="Category" value={data.category} />}
                {data.estimatedDate && (
                  <DetailField label="Estimated Date" value={data.estimatedDate} />
                )}
                {data.condition && <DetailField label="Condition" value={data.condition} />}
                {data.estimatedValue != null && (
                  <DetailField
                    label="Estimated Value"
                    value={`$${data.estimatedValue.toLocaleString()}`}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <DetailField
                label="Email"
                value={
                  <a
                    href={`mailto:${data.email}`}
                    className="hover:text-[#C6A96B] transition-colors"
                  >
                    {data.email}
                  </a>
                }
              />
              <DetailField
                label="Phone"
                value={
                  <a href={`tel:${data.phone}`} className="hover:text-[#C6A96B] transition-colors">
                    {data.phone}
                  </a>
                }
              />
              {data.address && <DetailField label="Address" value={data.address} />}
            </CardContent>
          </Card>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="secondary">{data.status}</Badge>

              <div className="space-y-2">
                <Label htmlFor="status-select">Update status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as ConsignmentStatus)}>
                  <SelectTrigger id="status-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="offered">Offered</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full"
                disabled={updateStatus.isPending}
                onClick={handleUpdateStatus}
              >
                {updateStatus.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Status
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-foreground/50">
              <p>Submitted: {formatDateTime(data?.createdAt.toString())}</p>
              <p>Updated: {formatDateTime(data?.updatedAt.toString())}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image lightbox */}
      {selectedImageIndex !== null && images.length > 0 && (
        <ImageModal
          images={images}
          currentIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
          onPrev={() =>
            setSelectedImageIndex((i) => (i === null ? 0 : i === 0 ? images.length - 1 : i - 1))
          }
          onNext={() =>
            setSelectedImageIndex((i) => (i === null ? 0 : i === images.length - 1 ? 0 : i + 1))
          }
        />
      )}
    </div>
  );
}

// ─── Detail field helper ──────────────────────────────────────────────────────

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-foreground/50 uppercase tracking-widest mb-1">{label}</p>
      <div className="text-sm">{value}</div>
    </div>
  );
}

// ─── Image lightbox ───────────────────────────────────────────────────────────

interface ImageModalProps {
  images: Array<{ url: string; publicId: string }>;
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function ImageModal({ images, currentIndex, onClose, onPrev, onNext }: ImageModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPrev();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNext();
  };

  const handleImgClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Close"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      <img
        src={images[currentIndex].url}
        alt={`Image ${currentIndex + 1}`}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-sm"
        onClick={handleImgClick}
      />

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-mono">
        {currentIndex + 1} / {images.length}
      </p>
    </div>
  );
}
