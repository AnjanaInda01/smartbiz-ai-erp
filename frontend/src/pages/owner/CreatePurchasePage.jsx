import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { getSuppliersApi } from "@/api/supplierApi";
import { getProductsApi } from "@/api/productApi";
import { createPurchaseApi } from "@/api/purchaseApi";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, ShoppingCart } from "lucide-react";

const purchaseSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product is required"),
      qty: z.coerce.number().min(1, "Quantity must be > 0"),
      costPrice: z.coerce.number().min(0.01, "Cost price must be > 0"),
    })
  ).min(1, "At least one item is required"),
});

export default function CreatePurchasePage() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierId: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      items: [{ productId: "", qty: 1, costPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [suppliersRes, productsRes] = await Promise.all([
        getSuppliersApi(),
        getProductsApi(),
      ]);
      setSuppliers(suppliersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const purchaseData = {
        supplierId: parseInt(data.supplierId),
        purchaseDate: data.purchaseDate,
        items: data.items.map((item) => ({
          productId: parseInt(item.productId),
          qty: parseInt(item.qty),
          costPrice: parseFloat(item.costPrice),
        })),
      };

      await createPurchaseApi(purchaseData);
      toast.success("Purchase created successfully");
      navigate("/owner/purchases");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create purchase";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    append({ productId: "", qty: 1, costPrice: 0 });
  };

  const calculateTotal = () => {
    const items = watch("items");
    return items.reduce((sum, item) => {
      const qty = parseFloat(item.qty) || 0;
      const cost = parseFloat(item.costPrice) || 0;
      return sum + (qty * cost);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Purchase"
        description="Record a purchase from supplier to update inventory and cost prices"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          {/* Supplier and Date */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Details</CardTitle>
              <CardDescription>Select supplier and purchase date</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supplierId">Supplier *</Label>
                  <select
                    id="supplierId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register("supplierId")}
                  >
                    <option value="">Select supplier</option>
                    {suppliers
                      .filter((s) => s.active)
                      .map((supplier) => (
                        <option key={supplier.id} value={supplier.id.toString()}>
                          {supplier.name}
                        </option>
                      ))}
                  </select>
                  {errors.supplierId && (
                    <p className="text-sm text-destructive">{errors.supplierId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date *</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    {...register("purchaseDate")}
                  />
                  {errors.purchaseDate && (
                    <p className="text-sm text-destructive">{errors.purchaseDate.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Purchase Items</CardTitle>
                  <CardDescription>Add products purchased from supplier</CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid gap-4 p-4 border rounded-lg md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Product *</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...register(`items.${index}.productId`)}
                    >
                      <option value="">Select product</option>
                      {products
                        .filter((p) => p.active)
                        .map((product) => (
                          <option key={product.id} value={product.id.toString()}>
                            {product.name} {product.sku && `(${product.sku})`}
                          </option>
                        ))}
                    </select>
                    {errors.items?.[index]?.productId && (
                      <p className="text-sm text-destructive">
                        {errors.items[index].productId.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      min="1"
                      {...register(`items.${index}.qty`)}
                    />
                    {errors.items?.[index]?.qty && (
                      <p className="text-sm text-destructive">
                        {errors.items[index].qty.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Cost Price *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      {...register(`items.${index}.costPrice`)}
                    />
                    {errors.items?.[index]?.costPrice && (
                      <p className="text-sm text-destructive">
                        {errors.items[index].costPrice.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-end">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {errors.items && typeof errors.items === "object" && "message" in errors.items && (
                <p className="text-sm text-destructive">{errors.items.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Total */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total Cost:</span>
                <span className="text-2xl font-bold">
                  ${calculateTotal().toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/owner/purchases")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Purchase"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
