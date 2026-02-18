import { useState, useEffect, useMemo } from "react";
import { getAiUsageApi } from "@/api/adminApi";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Brain, Building2, Crown, AlertCircle } from "lucide-react";

export default function AiUsagePage() {
  const [aiUsage, setAiUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    totalUsed: 0,
    totalLimit: 0,
  });

  useEffect(() => {
    loadAiUsage();
  }, []);

  const loadAiUsage = async () => {
    try {
      setLoading(true);
      const res = await getAiUsageApi();
      const data = res.data || [];
      setAiUsage(data);
      
      const totalUsed = data.reduce((sum, item) => sum + (item.usedThisMonth || 0), 0);
      const totalLimit = data.reduce((sum, item) => sum + (item.monthlyLimit || 0), 0);
      
      setStats({
        total: data.length,
        totalUsed,
        totalLimit,
      });
    } catch (error) {
      toast.error("Failed to load AI usage data");
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "businessName",
        header: "Business",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="font-medium">{row.original.businessName}</span>
          </div>
        ),
      },
      {
        accessorKey: "planName",
        header: "Plan",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-primary" />
            <span>{row.original.planName}</span>
          </div>
        ),
      },
      {
        accessorKey: "usedThisMonth",
        header: "Used This Month",
        cell: ({ row }) => {
          const used = row.original.usedThisMonth || 0;
          const limit = row.original.monthlyLimit || 0;
          const percentage = limit > 0 ? (used / limit) * 100 : 0;
          return (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{used}</span>
                <span className="text-muted-foreground">/ {limit}</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        },
      },
      {
        accessorKey: "remaining",
        header: "Remaining",
        cell: ({ row }) => {
          const remaining = row.original.remaining || 0;
          return (
            <Badge variant={remaining > 0 ? "default" : "destructive"}>
              {remaining}
            </Badge>
          );
        },
      },
      {
        accessorKey: "subscriptionStatus",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.subscriptionStatus === "ACTIVE" ? "default" : "secondary"}>
            {row.original.subscriptionStatus}
          </Badge>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Usage & Logs"
        description="Review AI usage across all businesses"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">With AI-enabled plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Used</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsed}</div>
            <p className="text-xs text-muted-foreground">AI requests this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Limit</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLimit}</div>
            <p className="text-xs text-muted-foreground">Monthly AI requests limit</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Usage Table */}
      <Card>
        <CardHeader>
          <CardTitle>AI Usage by Business</CardTitle>
          <CardDescription>Monthly AI request usage for each business</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : aiUsage.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Brain className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No AI usage data available</p>
            </div>
          ) : (
            <DataTable columns={columns} data={aiUsage} searchKey="businessName" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
