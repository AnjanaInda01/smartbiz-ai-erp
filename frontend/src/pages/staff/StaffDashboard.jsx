import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, FileText, DollarSign, Users, Truck, ShoppingCart, TrendingUp, Mail } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getProductsApi } from "@/api/productApi";
import { getInvoicesApi } from "@/api/invoiceApi";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInvoices: 0,
    totalRevenue: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, invoicesRes] = await Promise.all([
        getProductsApi(),
        getInvoicesApi(),
      ]);

      const products = productsRes.data || [];
      const invoices = invoicesRes.data || [];

      const revenue = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

      setStats({
        totalProducts: products.length,
        totalInvoices: invoices.length,
        totalRevenue: revenue,
      });

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
    <div className="space-y-6 animate-fade-in">
      <div className="animate-slide-down">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-2 animate-fade-in">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 animate-fade-in">
        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Total Products</CardTitle>
            <Package className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent" style={{ animationDelay: "100ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Total Invoices</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{stats.totalInvoices}</div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent" style={{ animationDelay: "200ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">${stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/staff/products">
                <Package className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Inventory</div>
                  <div className="text-sm text-muted-foreground">Manage products</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/staff/customers">
                <Users className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Customers</div>
                  <div className="text-sm text-muted-foreground">Manage customers</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/staff/invoices">
                <FileText className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Invoices</div>
                  <div className="text-sm text-muted-foreground">Create invoice</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/staff/ai-content">
                <Mail className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">AI Content</div>
                  <div className="text-sm text-muted-foreground">Generate content</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
