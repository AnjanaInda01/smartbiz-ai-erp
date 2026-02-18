import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/auth/AuthProvider";
import { normalizeRole } from "@/auth/roleRedirect";
import { getProductsApi, createProductApi, updateProductApi, deleteProductApi } from "@/api/productApi";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().optional(),
  unitPrice: z.coerce.number().min(0, "Price must be >= 0"),
  costPrice: z.coerce.number().min(0, "Cost price must be >= 0").optional(),
  stockQty: z.coerce.number().min(0, "Stock must be >= 0"),
});

export default function ProductsPage() {
  const { user } = useAuth();
  const role = normalizeRole(user?.role || "");
  const canEdit = role === "OWNER" || role === "ADMIN";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getProductsApi();
      setProducts(res.data || []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    reset();
    setDialogOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    reset({
      name: product.name,
      sku: product.sku || "",
      unitPrice: product.unitPrice,
      costPrice: product.costPrice || 0,
      stockQty: product.stockQty,
    });
    setDialogOpen(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      // Prepare data - only include costPrice if provided
      const productData = {
        name: data.name,
        sku: data.sku || null,
        unitPrice: data.unitPrice,
        stockQty: data.stockQty,
        ...(data.costPrice && data.costPrice > 0 ? { costPrice: data.costPrice } : {}),
      };

      if (selectedProduct) {
        await updateProductApi(selectedProduct.id, productData);
        toast.success("Product updated successfully");
      } else {
        await createProductApi(productData);
        toast.success("Product created successfully");
      }
      setDialogOpen(false);
      reset();
      loadProducts();
    } catch (error) {
      const message = error.response?.data?.message || "Operation failed";
      toast.error(message);
    }
  };

  const onDelete = async () => {
    try {
      await deleteProductApi(selectedProduct.id);
      toast.success("Product deleted successfully");
      setDeleteDialogOpen(false);
      loadProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "sku",
        header: "SKU",
      },
      {
        accessorKey: "unitPrice",
        header: "Price",
        cell: ({ row }) => `$${row.original.unitPrice?.toFixed(2) || 0}`,
      },
      {
        accessorKey: "stockQty",
        header: "Stock",
      },
      {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.active ? "default" : "secondary"}>
            {row.original.active ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      ...(canEdit
        ? [
            {
              id: "actions",
              header: "Actions",
              cell: ({ row }) => (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(row.original)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(row.original)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ),
            },
          ]
        : []),
    ],
    [canEdit]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        action={
          <Button onClick={handleCreate} className="animate-scale-in shadow-md hover:shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-12 animate-fade-in">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="animate-slide-up">
          <DataTable columns={columns} data={products} searchKey="name" />
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="animate-scale-in">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? "Edit Product" : "Create Product"}</DialogTitle>
            <DialogDescription className="text-base">
              {selectedProduct ? "Update product information" : "Add a new product to your catalog"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" {...register("sku")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price (Selling Price) *</Label>
                <Input id="unitPrice" type="number" step="0.01" {...register("unitPrice")} />
                {errors.unitPrice && (
                  <p className="text-sm text-destructive">{errors.unitPrice.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Price at which you sell to customers</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPrice">Cost Price (Purchase Price)</Label>
                <Input id="costPrice" type="number" step="0.01" {...register("costPrice")} />
                {errors.costPrice && (
                  <p className="text-sm text-destructive">{errors.costPrice.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Price at which you buy from suppliers (for profit calculation)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockQty">Stock Quantity *</Label>
                <Input id="stockQty" type="number" {...register("stockQty")} />
                {errors.stockQty && (
                  <p className="text-sm text-destructive">{errors.stockQty.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={onDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
