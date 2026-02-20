import { useState, useEffect, useMemo } from "react";
import { getPurchasesApi, confirmPurchaseApi } from "@/api/purchaseApi";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ShoppingCart, DollarSign, CheckCircle2, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PurchasesPage() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    totalCost: 0,
    pending: 0,
    confirmed: 0,
  });

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const res = await getPurchasesApi();
      const data = res.data || [];
      setPurchases(data);

      const totalCost = data.reduce((sum, p) => sum + (parseFloat(p.totalCost) || 0), 0);
      const pending = data.filter((p) => p.status === "DRAFT" || p.status === "PENDING").length;
      const confirmed = data.filter((p) => p.status === "CONFIRMED").length;

      setStats({
        total: data.length,
        totalCost,
        pending,
        confirmed,
      });
    } catch (error) {
      toast.error("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await confirmPurchaseApi(id);
      toast.success("Purchase confirmed successfully");
      loadPurchases();
    } catch (error) {
      toast.error("Failed to confirm purchase");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "purchaseNo",
        header: "Purchase No",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            <span className="font-medium">{row.original.purchaseNo}</span>
          </div>
        ),
      },
      {
        accessorKey: "purchaseDate",
        header: "Date",
        cell: ({ row }) => {
          const date = new Date(row.original.purchaseDate);
          return date.toLocaleDateString();
        },
      },
      {
        accessorKey: "totalCost",
        header: "Total Cost",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {parseFloat(row.original.totalCost || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge
              variant={status === "CONFIRMED" ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {status === "CONFIRMED" ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <Clock className="h-3 w-3" />
              )}
              {status === "DRAFT" ? "DRAFT" : status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {(row.original.status === "DRAFT" || row.original.status === "PENDING") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConfirm(row.original.id)}
              >
                Confirm Purchase
              </Button>
            )}
            {row.original.status === "CONFIRMED" && (
              <span className="text-sm text-muted-foreground">Confirmed</span>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Purchases"
        description="Track your purchases and expenses"
        action={
          <Button onClick={() => navigate("/staff/purchases/create")} className="animate-scale-in shadow-md hover:shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Create Purchase
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 animate-fade-in">
        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Total Purchases</CardTitle>
            <ShoppingCart className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{stats.total}</div>
            <p className="text-sm text-muted-foreground mt-1">All purchases</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent" style={{ animationDelay: "100ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Total Expenses</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ${stats.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Total cost</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent" style={{ animationDelay: "200ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Pending</CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{stats.pending}</div>
            <p className="text-sm text-muted-foreground mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent" style={{ animationDelay: "300ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Confirmed</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{stats.confirmed}</div>
            <p className="text-sm text-muted-foreground mt-1">Completed purchases</p>
          </CardContent>
        </Card>
      </div>

      {/* Purchases Table */}
      <Card className="animate-slide-up shadow-premium">
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
          <CardDescription>All your purchase records</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : purchases.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <ShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No purchases recorded yet</p>
            </div>
          ) : (
            <DataTable columns={columns} data={purchases} searchKey="purchaseNo" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
