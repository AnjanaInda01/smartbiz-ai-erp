import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Package, Users, FileText, DollarSign, Crown, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getProductsApi } from "@/api/productApi";
import { getCustomersApi } from "@/api/customerApi";
import { getInvoicesApi } from "@/api/invoiceApi";
import { getBusinessSubscriptionApi } from "@/api/subscriptionApi";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function OwnerDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalInvoices: 0,
    totalRevenue: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, customersRes, invoicesRes, subscriptionRes] = await Promise.all([
        getProductsApi(),
        getCustomersApi(),
        getInvoicesApi(),
        getBusinessSubscriptionApi().catch(() => ({ data: null })),
      ]);

      const products = productsRes.data || [];
      const customers = customersRes.data || [];
      const invoices = invoicesRes.data || [];

      const revenue = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

      setStats({
        totalProducts: products.length,
        totalCustomers: customers.length,
        totalInvoices: invoices.length,
        totalRevenue: revenue,
      });

      setSubscription(subscriptionRes.data);

      // Generate sample chart data (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          sales: Math.floor(Math.random() * 5000) + 1000,
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="mr-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Revenue
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>

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
          <div className="grid gap-4 md:grid-cols-3">
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/owner/products">
                <Package className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Manage Products</div>
                  <div className="text-sm text-muted-foreground">Add or edit products</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/owner/customers">
                <Users className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Manage Customers</div>
                  <div className="text-sm text-muted-foreground">View customer list</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/owner/invoices">
                <FileText className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Create Invoice</div>
                  <div className="text-sm text-muted-foreground">Generate new invoice</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
