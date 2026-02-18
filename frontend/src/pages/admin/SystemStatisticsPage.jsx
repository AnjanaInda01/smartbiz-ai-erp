import { useState, useEffect } from "react";
import { getSystemStatisticsApi } from "@/api/adminApi";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Building2,
  Users,
  Package,
  UserCheck,
  FileText,
  Brain,
  Crown,
  TrendingUp,
} from "lucide-react";

export default function SystemStatisticsPage() {
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalInvoices: 0,
    totalAiRequests: 0,
    activeSubscriptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const res = await getSystemStatisticsApi();
      setStats(res.data || {});
    } catch (error) {
      toast.error("Failed to load system statistics");
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

  const statCards = [
    {
      title: "Total Businesses",
      value: stats.totalBusinesses,
      icon: Building2,
      description: "Registered businesses",
      color: "text-blue-600",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: "All system users",
      color: "text-green-600",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      description: "Products across all businesses",
      color: "text-purple-600",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: UserCheck,
      description: "Customers across all businesses",
      color: "text-orange-600",
    },
    {
      title: "Total Invoices",
      value: stats.totalInvoices,
      icon: FileText,
      description: "Invoices generated",
      color: "text-red-600",
    },
    {
      title: "AI Requests",
      value: stats.totalAiRequests,
      icon: Brain,
      description: "Total AI requests made",
      color: "text-indigo-600",
    },
    {
      title: "Active Subscriptions",
      value: stats.activeSubscriptions,
      icon: Crown,
      description: "Currently active subscriptions",
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="System Statistics"
        description="View system-wide statistics and metrics"
      />

      {/* Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent" style={{ animationDelay: `${index * 50}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 text-primary`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{stat.value.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Card */}
      <Card className="animate-slide-up shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            System Overview
          </CardTitle>
          <CardDescription>Key metrics at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Products per Business</p>
              <p className="text-2xl font-bold">
                {stats.totalBusinesses > 0
                  ? Math.round(stats.totalProducts / stats.totalBusinesses)
                  : 0}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Customers per Business</p>
              <p className="text-2xl font-bold">
                {stats.totalBusinesses > 0
                  ? Math.round(stats.totalCustomers / stats.totalBusinesses)
                  : 0}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Invoices per Business</p>
              <p className="text-2xl font-bold">
                {stats.totalBusinesses > 0
                  ? Math.round(stats.totalInvoices / stats.totalBusinesses)
                  : 0}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Subscription Rate</p>
              <p className="text-2xl font-bold">
                {stats.totalBusinesses > 0
                  ? Math.round((stats.activeSubscriptions / stats.totalBusinesses) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
