import { useState, useEffect } from "react";
import { getDashboardReportApi } from "@/api/reportApi";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const res = await getDashboardReportApi();
      setReport(res.data);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>No report data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Sales Reports & Summaries"
        description="View your business performance and analytics"
      />

      {/* Sales Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Today's Sales</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ${parseFloat(report.todaySales || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Sales today</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent" style={{ animationDelay: "100ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Month's Sales</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ${parseFloat(report.monthSales || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent" style={{ animationDelay: "200ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Today's Profit</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ${parseFloat(report.todayProfit || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Profit today</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent" style={{ animationDelay: "300ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Month's Profit</CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ${parseFloat(report.monthProfit || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 animate-fade-in">
        <Card className="animate-slide-up hover:shadow-xl transition-premium shadow-premium">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Business Overview</CardTitle>
            <CardDescription className="text-base">Key metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 transition-premium hover:bg-accent">
              <span className="text-base text-muted-foreground">Total Customers</span>
              <span className="text-xl font-bold text-primary">{report.totalCustomers}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 transition-premium hover:bg-accent">
              <span className="text-base text-muted-foreground">Total Products</span>
              <span className="text-xl font-bold text-primary">{report.totalProducts}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up hover:shadow-xl transition-premium shadow-premium" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>Products running low</CardDescription>
          </CardHeader>
          <CardContent>
            {report.lowStockProducts && report.lowStockProducts.length > 0 ? (
              <div className="space-y-2">
                {report.lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <Badge variant="destructive">
                      <Package className="h-3 w-3 mr-1" />
                      {product.stockQty} left
                    </Badge>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link to="/owner/products">Manage Products</Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">All products are well stocked</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
