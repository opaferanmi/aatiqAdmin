import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/products/ProductForm";
import { useProduct, useUpdateProduct } from "@/lib/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { LoadingSpinner } from "@/components/ui-extras/LoadingSpinner";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

export function EditProductPage() {
  const { id } = useParams({ from: "/dashboard/products/$id" });
  const { data, isLoading } = useProduct(id);
  const update = useUpdateProduct(id);

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-2">
        <Link to="/dashboard/products">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
        </Link>
      </Button>
      <PageHeader title="Edit Product" description={data?.title ?? ""} />
      {isLoading || !data ? (
        <LoadingSpinner label="Loading product..." />
      ) : (
        <ProductForm
          defaultValues={data}
          submitting={update.isPending}
          submitLabel="Save changes"
          onSubmit={async (values) => {
            try {
              await update.mutateAsync(values);
              toast.success("Product updated");
            } catch (e) {
              toast.error(getApiErrorMessage(e));
            }
          }}
        />
      )}
    </div>
  );
}
