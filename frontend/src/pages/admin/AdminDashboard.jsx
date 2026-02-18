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
