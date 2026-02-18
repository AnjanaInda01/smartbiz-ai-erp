import { useState, useEffect } from "react";
import {
  getSubscriptionPlansApi,
  getBusinessSubscriptionApi,
  subscribeBusinessApi,
  cancelSubscriptionApi,
  getSubscriptionHistoryApi,
} from "@/api/subscriptionApi";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Crown, Check, X, Calendar, CreditCard } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function SubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansRes, subscriptionRes, historyRes] = await Promise.all([
        getSubscriptionPlansApi(),
        getBusinessSubscriptionApi().catch(() => ({ data: null })),
        getSubscriptionHistoryApi().catch(() => ({ data: [] })),
      ]);

      setPlans(plansRes.data || []);
      setCurrentSubscription(subscriptionRes.data);
      setSubscriptionHistory(historyRes.data || []);
    } catch (error) {
      toast.error("Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      await subscribeBusinessApi(planId);
      toast.success("Subscription activated successfully");
      loadData();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to subscribe";
      toast.error(message);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSubscriptionApi();
      toast.success("Subscription cancelled successfully");
      setCancelDialogOpen(false);
      loadData();
    } catch (error) {
      toast.error("Failed to cancel subscription");
    }
  };

  const formatLimit = (value) => {
    return value === -1 || value === null ? "Unlimited" : value.toLocaleString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Management"
        description="Manage your business subscription plan"
      />

      {/* Current Subscription */}
      {currentSubscription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Your active subscription plan</CardDescription>
              </div>
              <Badge variant={currentSubscription.status === "ACTIVE" ? "default" : "secondary"}>
                {currentSubscription.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Plan Name</p>
                <p className="text-lg font-semibold">{currentSubscription.planName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="text-lg font-semibold">
                  ${currentSubscription.price?.toFixed(2)}/{currentSubscription.durationMonths}mo
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="text-lg font-semibold">{formatDate(currentSubscription.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="text-lg font-semibold">{formatDate(currentSubscription.endDate)}</p>
              </div>
            </div>
            {currentSubscription.status === "ACTIVE" && (
              <div className="mt-4">
                <Button variant="destructive" onClick={() => setCancelDialogOpen(true)}>
                  Cancel Subscription
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Choose a subscription plan that fits your business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {plans
              .filter((plan) => plan.active)
              .map((plan) => {
                const isCurrentPlan =
                  currentSubscription?.planId === plan.id &&
                  currentSubscription?.status === "ACTIVE";
                return (
                  <Card key={plan.id} className={isCurrentPlan ? "border-primary" : ""}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Crown className="h-5 w-5 text-primary" />
                          {plan.name}
                        </CardTitle>
                        {isCurrentPlan && (
                          <Badge variant="default">Current</Badge>
                        )}
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-3xl font-bold">${plan.price?.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            per {plan.durationMonths} {plan.durationMonths === 1 ? "month" : "months"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span className="text-sm">
                              {formatLimit(plan.maxProducts)} Products
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span className="text-sm">
                              {formatLimit(plan.maxCustomers)} Customers
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span className="text-sm">
                              {formatLimit(plan.maxInvoices)} Invoices
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary" />
                            <span className="text-sm">
                              {formatLimit(plan.maxStaff)} Staff Members
                            </span>
                          </div>
                        </div>

                        {!isCurrentPlan && (
                          <Button
                            className="w-full"
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={!plan.active}
                          >
                            {currentSubscription ? "Switch Plan" : "Subscribe"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Subscription History */}
      {subscriptionHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subscription History</CardTitle>
            <CardDescription>Your subscription history</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptionHistory.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.planName}</TableCell>
                    <TableCell>{formatDate(sub.startDate)}</TableCell>
                    <TableCell>{formatDate(sub.endDate)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sub.status === "ACTIVE"
                            ? "default"
                            : sub.status === "CANCELLED"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell>${sub.price?.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancel}
        title="Cancel Subscription"
        description="Are you sure you want to cancel your subscription? Your subscription will remain active until the end of the current billing period."
      />
    </div>
  );
}
