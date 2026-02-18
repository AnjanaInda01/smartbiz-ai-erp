import { useState, useEffect } from "react";
import {
  getActiveSubscriptionPlansApi,
  getBusinessSubscriptionApi,
  subscribeBusinessApi,
  cancelSubscriptionApi,
} from "@/api/subscriptionApi";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, Sparkles, Zap, Shield, BarChart3, Users, Package, FileText, Brain, Crown } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function SubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansRes, subscriptionRes] = await Promise.all([
        getActiveSubscriptionPlansApi(),
        getBusinessSubscriptionApi().catch(() => ({ data: null })),
      ]);

      setPlans(plansRes.data || []);
      setCurrentSubscription(subscriptionRes.data);
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
    return value === -1 || value === null || value === 999999 ? "Unlimited" : value.toLocaleString();
  };

  // Filter active plans and sort by price (free first, then by price)
  const activePlans = plans
    .filter((p) => p.active !== false)
    .sort((a, b) => {
      const priceA = parseFloat(a.monthlyPrice || 0);
      const priceB = parseFloat(b.monthlyPrice || 0);
      return priceA - priceB;
    });

  const isCurrentPlan = (planId) => {
    return currentSubscription?.planId === planId && currentSubscription?.status === "ACTIVE";
  };

  const isFreePlan = (plan) => {
    return parseFloat(plan.monthlyPrice || 0) === 0 || plan.name?.toUpperCase() === "FREE";
  };

  const isProPlan = (plan) => {
    return parseFloat(plan.monthlyPrice || 0) > 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Plans"
        description="Choose the perfect plan for your business"
      />

      {/* Pricing Cards - Show all active plans */}
      <div className={`grid gap-6 max-w-6xl mx-auto ${activePlans.length === 1 ? 'md:grid-cols-1' : activePlans.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {activePlans.map((plan) => {
          const isCurrent = isCurrentPlan(plan.id);
          const isFree = isFreePlan(plan);
          const isPro = isProPlan(plan);

          return (
            <Card
              key={plan.id}
              className={`relative overflow-hidden border-2 ${
                isPro ? "border-primary" : ""
              }`}
            >
              {/* Current Plan Badge */}
              {isCurrent && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-green-500 text-white px-4 py-1 rounded-full">
                    Current Plan
                  </Badge>
                </div>
              )}

              {/* Popular Badge for Pro plans */}
              {isPro && !isCurrent && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-purple-500 text-white px-4 py-1 rounded-full">
                    POPULAR
                  </Badge>
                </div>
              )}

              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    {isFree ? (
                      <span className="text-4xl font-bold text-green-600">Free</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">
                          ${parseFloat(plan.monthlyPrice || 0).toFixed(2)}
                        </span>
                        <span className="text-muted-foreground text-lg">/month</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isFree
                      ? "Perfect for getting started"
                      : isPro
                      ? "Everything you need to grow your business"
                      : "Great value for your business"}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      {isFree ? "Basic" : "Advanced"} dashboard access
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      {formatLimit(plan.maxProducts)} products
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      {formatLimit(plan.maxUsers)} users
                    </span>
                  </div>
                  {isPro && (
                    <>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Advanced reporting & analytics</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">
                          {formatLimit(plan.maxAiRequestsPerMonth)} AI requests/month
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Priority support</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Custom integrations</span>
                      </div>
                    </>
                  )}
                  {isFree && (
                    <>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Basic reporting</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Email support</span>
                      </div>
                    </>
                  )}
                </div>

                {isCurrent ? (
                  <Button
                    variant="outline"
                    className="w-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-not-allowed"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : isFree ? (
                  <Button
                    variant="outline"
                    className="w-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-not-allowed"
                    disabled
                  >
                    Free Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-6 text-lg"
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Upgrade to {plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Subscription Details */}
      {currentSubscription && currentSubscription.status === "ACTIVE" && (
        <Card className="max-w-5xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Current Subscription</h3>
                <p className="text-sm text-muted-foreground">
                  {currentSubscription.planName} • Active until {new Date(currentSubscription.endDate).toLocaleDateString()}
                </p>
              </div>
              <Button variant="destructive" onClick={() => setCancelDialogOpen(true)}>
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Comparison */}
      <Card className="max-w-5xl mx-auto">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-center">Feature Comparison</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Analytics & Reports</h4>
              <p className="text-sm text-muted-foreground">
                Compare features across all available plans
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">AI Features</h4>
              <p className="text-sm text-muted-foreground">
                AI-powered insights vary by plan
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Support</h4>
              <p className="text-sm text-muted-foreground">
                Support level depends on your plan
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
