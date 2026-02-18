import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Building2, Brain, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">System administration panel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin</CardTitle>
          <CardDescription>System administration and management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/admin/businesses">
                <Building2 className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Registered Businesses</div>
                  <div className="text-sm text-muted-foreground">View and manage businesses</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/admin/ai-usage">
                <Brain className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">AI Usage & Logs</div>
                  <div className="text-sm text-muted-foreground">Review AI usage across businesses</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/admin/statistics">
                <BarChart3 className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">System Statistics</div>
                  <div className="text-sm text-muted-foreground">View system-wide metrics</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col items-start p-4">
              <Link to="/admin/subscription-plans">
                <Crown className="mb-2 h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Subscription Plans</div>
                  <div className="text-sm text-muted-foreground">Manage subscription plans</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
