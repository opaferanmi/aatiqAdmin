import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/products/ProductForm";
import { useCreateProduct } from "@/lib/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui-extras/PageHeader";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

export function CreateProductPage() {
  const navigate = useNavigate();
  const create = useCreateProduct();

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-2">
        <Link to="/dashboard/products">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to products
        </Link>
      </Button>
      <PageHeader title="Create Product" description="Add a new item to your inventory" />
      <ProductForm
        submitting={create.isPending}
        submitLabel="Create product"
        onSubmit={async (values) => {
          try {
            const created = await create.mutateAsync(values);
            toast.success("Product created");
            navigate({ to: "/dashboard/products/$id", params: { id: created._id } });
          } catch (e) {
            toast.error(getApiErrorMessage(e));
          }
        }}
      />
    </div>
  );
}
