import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Crown, 
  Building2, 
  Brain, 
  BarChart3, 
  Users, 
  Package, 
  UserCheck, 
  FileText,
  TrendingUp,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { getSystemStatisticsApi } from "@/api/adminApi";
import { getBusinessesApi } from "@/api/businessApi";
import { toast } from "sonner";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalInvoices: 0,
    totalAiRequests: 0,
    activeSubscriptions: 0,
  });
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, businessesRes] = await Promise.all([
        getSystemStatisticsApi(),
        getBusinessesApi().catch(() => ({ data: [] })),
      ]);

      const statistics = statsRes.data || {};
      setStats({
        totalBusinesses: statistics.totalBusinesses || 0,
        totalUsers: statistics.totalUsers || 0,
        totalProducts: statistics.totalProducts || 0,
        totalCustomers: statistics.totalCustomers || 0,
        totalInvoices: statistics.totalInvoices || 0,
        totalAiRequests: statistics.totalAiRequests || 0,
        activeSubscriptions: statistics.activeSubscriptions || 0,
      });

      // Process subscription data for charts
      const businesses = businessesRes.data || [];
      const freeCount = businesses.filter((b) => b.subscriptionPlan?.toUpperCase() === "FREE").length;
      const proCount = businesses.filter((b) => b.subscriptionPlan?.toUpperCase() === "PRO").length;
      const noPlanCount = businesses.filter((b) => !b.subscriptionPlan).length;

      setSubscriptionData([
        { name: "FREE", value: freeCount, color: "#6b7280" },
        { name: "PRO", value: proCount, color: "#3b82f6" },
        { name: "No Plan", value: noPlanCount, color: "#e5e7eb" },
      ]);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for bar chart
  const metricsData = [
    { name: "Businesses", value: stats.totalBusinesses },
    { name: "Users", value: stats.totalUsers },
    { name: "Products", value: stats.totalProducts },
    { name: "Customers", value: stats.totalCustomers },
    { name: "Invoices", value: stats.totalInvoices },
    { name: "AI Requests", value: stats.totalAiRequests },
  ];

  const kpiCards = [
    {
      title: "Total Businesses",
      value: stats.totalBusinesses,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/admin/businesses",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Subscriptions",
      value: stats.activeSubscriptions,
      icon: Crown,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      link: "/admin/subscription-plans",
    },
    {
      title: "AI Requests",
      value: stats.totalAiRequests,
      icon: Brain,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/admin/ai-usage",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="animate-slide-down">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-lg text-muted-foreground mt-2">System administration panel - Manage all businesses</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          const borderColors = [
            "border-l-primary/50 hover:border-l-primary",
            "border-l-chart-2/50 hover:border-l-chart-2",
            "border-l-chart-3/50 hover:border-l-chart-3",
            "border-l-chart-4/50 hover:border-l-chart-4",
          ];
          const content = (
            <Card className={cn(
              "group hover:shadow-premium transition-premium animate-slide-up border-l-4",
              borderColors[index % borderColors.length]
            )} style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-medium text-muted-foreground">{card.title}</p>
                    <p className={cn(
                      "text-4xl font-bold mt-2 bg-gradient-to-r bg-clip-text text-transparent",
                      index === 0 && "from-primary to-primary/60",
                      index === 1 && "from-chart-2 to-chart-2/60",
                      index === 2 && "from-chart-3 to-chart-3/60",
                      index === 3 && "from-chart-4 to-chart-4/60"
                    )}>
                      {card.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={cn(
                    "p-3 rounded-lg transition-all duration-300 group-hover:scale-110",
                    card.bgColor
                  )}>
                    <Icon className={cn("h-6 w-6 transition-transform group-hover:rotate-12", card.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );

          return card.link ? (
            <Link key={index} to={card.link} className="block">
              {content}
            </Link>
          ) : (
            <div key={index}>{content}</div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Subscription Distribution Pie Chart */}
        <Card className="shadow-premium transition-premium animate-slide-up hover:shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
            <CardTitle className="text-2xl font-bold">Subscription Plans Distribution</CardTitle>
            <CardDescription className="text-base mt-1">Breakdown of businesses by subscription plan</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Metrics Bar Chart */}
        <Card className="shadow-premium transition-premium animate-slide-up hover:shadow-xl">
          <CardHeader className="bg-gradient-to-r from-chart-2/5 to-transparent border-b">
            <CardTitle className="text-2xl font-bold">System Metrics Overview</CardTitle>
            <CardDescription className="text-base mt-1">Key metrics across the system</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Products</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalProducts.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Products across all businesses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Customers</CardTitle>
            <UserCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Customers across all businesses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Total Invoices</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalInvoices.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Invoices generated system-wide</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>System administration and management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/admin/businesses" className="block">
              <Button variant="outline" className="h-auto w-full flex-col items-start p-4 hover:bg-accent transition-colors">
                <Building2 className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Registered Businesses</div>
                  <div className="text-sm text-muted-foreground">View and manage businesses</div>
                </div>
              </Button>
            </Link>
            <Link to="/admin/ai-usage" className="block">
              <Button variant="outline" className="h-auto w-full flex-col items-start p-4 hover:bg-accent transition-colors">
                <Brain className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">AI Usage & Logs</div>
                  <div className="text-sm text-muted-foreground">Review AI usage across businesses</div>
                </div>
              </Button>
            </Link>
            <Link to="/admin/statistics" className="block">
              <Button variant="outline" className="h-auto w-full flex-col items-start p-4 hover:bg-accent transition-colors">
                <BarChart3 className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">System Statistics</div>
                  <div className="text-sm text-muted-foreground">View system-wide metrics</div>
                </div>
              </Button>
            </Link>
            <Link to="/admin/subscription-plans" className="block">
              <Button variant="outline" className="h-auto w-full flex-col items-start p-4 hover:bg-accent transition-colors">
                <Crown className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Subscription Plans</div>
                  <div className="text-sm text-muted-foreground">Manage subscription plans</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
