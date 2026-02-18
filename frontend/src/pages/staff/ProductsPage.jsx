import { useState, useEffect, useMemo } from "react";
import { getProductsApi } from "@/api/productApi";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="View product catalog"
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={products} searchKey="name" />
      )}
    </div>
  );
}
