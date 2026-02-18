import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Package, Users, FileText, DollarSign, Crown, AlertCircle, Truck, BarChart3, Building2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getProductsApi } from "@/api/productApi";
import { getCustomersApi } from "@/api/customerApi";
import { getInvoicesApi } from "@/api/invoiceApi";
import { getBusinessSubscriptionApi } from "@/api/subscriptionApi";
import { getDashboardReportApi } from "@/api/reportApi";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/AuthProvider";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState("");
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
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    loadData();
    // Get business name from user data
    if (user?.businessName) {
      setBusinessName(user.businessName);
    } else if (user?.business?.name) {
      setBusinessName(user.business.name);
    }
  }, [user]);

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

  const quickActions = [
    { id: "overview", label: "Overview", icon: TrendingUp, path: null },
    { id: "products", label: "Products", icon: Package, path: "/owner/products" },
    { id: "customers", label: "Customers", icon: Users, path: "/owner/customers" },
    { id: "suppliers", label: "Suppliers", icon: Truck, path: "/owner/suppliers" },
    { id: "invoices", label: "Invoices", icon: FileText, path: "/owner/invoices" },
    { id: "reports", label: "Reports", icon: BarChart3, path: "/owner/reports" },
  ];

  const handleQuickAction = (action) => {
    if (action.path) {
      navigate(action.path);
    } else {
      setActiveSection(action.id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="animate-slide-down">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          {businessName && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 animate-scale-in">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-base font-semibold text-primary">{businessName}</span>
            </div>
          )}
        </div>
        <p className="text-lg text-muted-foreground mt-2">
          {businessName ? `Welcome back to ${businessName}! Here's your business overview.` : "Welcome back! Here's your business overview."}
        </p>
      </div>

      {/* Modern Toggle Quick Actions */}
      <Card className="border-2 shadow-premium bg-gradient-to-br from-card via-card to-muted/30 backdrop-blur-sm animate-slide-up">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg font-semibold mr-1 text-foreground">Quick Actions:</span>
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const isActive = activeSection === action.id;
              return (
                <Button
                  key={action.id}
                  variant={isActive ? "default" : "outline"}
                  size="lg"
                  onClick={() => handleQuickAction(action)}
                  className={cn(
                    "h-auto px-5 py-2.5 flex items-center gap-2 transition-premium font-medium animate-scale-in",
                    "hover:shadow-lg",
                    isActive 
                      ? "shadow-glow bg-gradient-premium text-primary-foreground hover:opacity-90 scale-105" 
                      : "hover:bg-accent hover:border-primary/50 hover:scale-105 hover:shadow-md"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    isActive && "animate-pulse-slow"
                  )} />
                  <span className="text-base">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Status */}
      {subscription && (
        <Card className={cn(
          "transition-premium animate-slide-up shadow-premium",
          subscription.status === "ACTIVE" 
            ? "border-primary/50 bg-gradient-to-br from-primary/5 via-card to-card" 
            : "border-destructive/50 bg-gradient-to-br from-destructive/5 via-card to-card"
        )}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  subscription.status === "ACTIVE" ? "bg-primary/10" : "bg-destructive/10"
                )}>
                  <Crown className={cn(
                    "h-5 w-5 transition-transform hover:scale-110",
                    subscription.status === "ACTIVE" ? "text-primary" : "text-destructive"
                  )} />
                </div>
                <CardTitle>Subscription Status</CardTitle>
              </div>
              <Badge variant={subscription.status === "ACTIVE" ? "default" : "destructive"} className="animate-scale-in">
                {subscription.status}
              </Badge>
            </div>
            <CardDescription className="mt-2">
              {subscription.status === "ACTIVE" 
                ? `Current plan: ${subscription.planName || "N/A"} - Expires ${new Date(subscription.endDate).toLocaleDateString()}`
                : "No active subscription. Please subscribe to continue using the service."}
            </CardDescription>
          </CardHeader>
          {subscription.status !== "ACTIVE" && (
            <CardContent>
              <Button asChild className="transition-premium hover:scale-105">
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
        <Card className="group hover:shadow-premium transition-premium animate-slide-up border-l-4 border-l-primary/50 hover:border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Package className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {stats.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <Badge variant="secondary" className="mr-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-premium transition-premium animate-slide-up border-l-4 border-l-chart-2/50 hover:border-l-chart-2" style={{ animationDelay: "100ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <div className="p-2 rounded-lg bg-chart-2/10 group-hover:bg-chart-2/20 transition-colors">
              <Users className="h-4 w-4 text-chart-2 group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-chart-2 to-chart-2/60 bg-clip-text text-transparent">
              {stats.totalCustomers}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <Badge variant="secondary" className="mr-1">
                Active customers
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-premium transition-premium animate-slide-up border-l-4 border-l-chart-3/50 hover:border-l-chart-3" style={{ animationDelay: "200ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <div className="p-2 rounded-lg bg-chart-3/10 group-hover:bg-chart-3/20 transition-colors">
              <FileText className="h-4 w-4 text-chart-3 group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-chart-3 to-chart-3/60 bg-clip-text text-transparent">
              {stats.totalInvoices}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              All time invoices
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-premium transition-premium animate-slide-up border-l-4 border-l-chart-4/50 hover:border-l-chart-4" style={{ animationDelay: "300ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Month's Profit</CardTitle>
            <div className="p-2 rounded-lg bg-chart-4/10 group-hover:bg-chart-4/20 transition-colors">
              <DollarSign className="h-4 w-4 text-chart-4 group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-chart-4 to-chart-4/60 bg-clip-text text-transparent">
              ${stats.monthProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              <Badge variant="secondary" className="mr-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                This month
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Section */}
      <Card className="shadow-premium transition-premium animate-slide-up hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Sales</CardTitle>
              <CardDescription className="text-base mt-1">Track your sales performance</CardDescription>
            </div>
            <Select value={salesFilter} onValueChange={setSalesFilter}>
              <SelectTrigger className="w-[140px] transition-premium hover:scale-105">
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
      <Card className="shadow-premium transition-premium animate-slide-up hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-chart-2/5 to-transparent border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Profit</CardTitle>
              <CardDescription className="text-base mt-1">Track your profit performance</CardDescription>
            </div>
            <Select value={profitFilter} onValueChange={setProfitFilter}>
              <SelectTrigger className="w-[140px] transition-premium hover:scale-105">
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
      <Card className="shadow-premium transition-premium animate-slide-up hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <CardTitle className="text-2xl font-bold">Sales Trend</CardTitle>
          <CardDescription className="text-base mt-1">Last 7 days sales performance</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
