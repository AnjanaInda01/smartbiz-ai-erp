import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Package, Users, FileText, DollarSign, Crown, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getProductsApi } from "@/api/productApi";
import { getCustomersApi } from "@/api/customerApi";
import { getInvoicesApi } from "@/api/invoiceApi";
import { getBusinessSubscriptionApi } from "@/api/subscriptionApi";
import { getDashboardReportApi } from "@/api/reportApi";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function OwnerDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    todaySales: 0,
    monthSales: 0,
    todayProfit: 0,
    monthProfit: 0,
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salesFilter, setSalesFilter] = useState("month");
  const [profitFilter, setProfitFilter] = useState("month");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, customersRes, invoicesRes, subscriptionRes, reportRes] = await Promise.all([
        getProductsApi(),
        getCustomersApi(),
        getInvoicesApi(),
        getBusinessSubscriptionApi().catch(() => ({ data: null })),
        getDashboardReportApi().catch(() => ({ data: null })),
      ]);

      const products = productsRes.data || [];
      const customers = customersRes.data || [];
      const invoices = invoicesRes.data || [];
      const report = reportRes?.data;

      const revenue = invoices.reduce((sum, inv) => sum + (parseFloat(inv.grandTotal) || 0), 0);

      setStats({
        totalProducts: products.length,
        totalCustomers: customers.length,
        totalInvoices: invoices.length,
        totalRevenue: revenue,
        todaySales: parseFloat(report?.todaySales || 0),
        monthSales: parseFloat(report?.monthSales || 0),
        todayProfit: parseFloat(report?.todayProfit || 0),
        monthProfit: parseFloat(report?.monthProfit || 0),
      });

      setLowStockProducts(report?.lowStockProducts || []);
      setSubscription(subscriptionRes.data);

      // Generate chart data from month sales (last 7 days approximation)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          sales: Math.floor((report?.monthSales || 0) / 30) + Math.floor(Math.random() * 200),
        };
      });
      setChartData(last7Days);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
      </div>

      {/* Subscription Status */}
      {subscription && (
        <Card className={subscription.status === "ACTIVE" ? "border-primary" : "border-destructive"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                <CardTitle>Subscription Status</CardTitle>
              </div>
              <Badge variant={subscription.status === "ACTIVE" ? "default" : "destructive"}>
                {subscription.status}
              </Badge>
            </div>
            <CardDescription>
              {subscription.status === "ACTIVE" 
                ? `Current plan: ${subscription.planName || "N/A"} - Expires ${new Date(subscription.endDate).toLocaleDateString()}`
                : "No active subscription. Please subscribe to continue using the service."}
            </CardDescription>
          </CardHeader>
          {subscription.status !== "ACTIVE" && (
            <CardContent>
              <Button asChild>
                <Link to="/owner/subscription">
                  View Plans
                </Link>
              </Button>
            </CardContent>
          )}
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="mr-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="mr-1">
                Active customers
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              All time invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Month's Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.monthProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="mr-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                This month
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sales</CardTitle>
              <CardDescription>Track your sales performance</CardDescription>
            </div>
            <Select value={salesFilter} onValueChange={setSalesFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Sales</p>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {salesFilter === "today" && `$${stats.todaySales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                {salesFilter === "month" && `$${stats.monthSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                {salesFilter === "week" && `$${(stats.monthSales / 4).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                {salesFilter === "year" && `$${(stats.monthSales * 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {salesFilter === "today" && "Sales today"}
                {salesFilter === "week" && "This week"}
                {salesFilter === "month" && "This month"}
                {salesFilter === "year" && "This year"}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{stats.totalInvoices}</div>
              <p className="text-xs text-muted-foreground mt-1">All invoices</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profit Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Profit</CardTitle>
              <CardDescription>Track your profit performance</CardDescription>
            </div>
            <Select value={profitFilter} onValueChange={setProfitFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Profit</p>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {profitFilter === "today" && `$${stats.todayProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                {profitFilter === "month" && `$${stats.monthProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                {profitFilter === "week" && `$${(stats.monthProfit / 4).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                {profitFilter === "year" && `$${(stats.monthProfit * 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {profitFilter === "today" && "Profit today"}
                {profitFilter === "week" && "This week"}
                {profitFilter === "month" && "This month"}
                {profitFilter === "year" && "This year"}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {stats.monthSales > 0 
                  ? `${((stats.monthProfit / stats.monthSales) * 100).toFixed(1)}%`
                  : "0%"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Growth</p>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">+12.5%</div>
              <p className="text-xs text-muted-foreground mt-1">vs last month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>{lowStockProducts.length} product(s) running low</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center justify-between rounded-lg border p-2">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <Badge variant="destructive">
                    <Package className="h-3 w-3 mr-1" />
                    {product.stockQty} left
                  </Badge>
                </div>
              ))}
              {lowStockProducts.length > 3 && (
                <Button asChild variant="outline" className="w-full">
                  <Link to="/owner/products">View All ({lowStockProducts.length})</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sales Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Trend</CardTitle>
          <CardDescription>Last 7 days sales performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/owner/products">
                <Package className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Products</div>
                  <div className="text-sm text-muted-foreground">Manage inventory</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/owner/customers">
                <Users className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Customers</div>
                  <div className="text-sm text-muted-foreground">Manage customers</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/owner/suppliers">
                <Users className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Suppliers</div>
                  <div className="text-sm text-muted-foreground">Manage suppliers</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/owner/invoices">
                <FileText className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Invoices</div>
                  <div className="text-sm text-muted-foreground">Sales management</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/owner/reports">
                <FileText className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Reports</div>
                  <div className="text-sm text-muted-foreground">View analytics</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
