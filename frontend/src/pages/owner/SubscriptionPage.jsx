import { useState, useEffect } from "react";
import {
  getSubscriptionPlansApi,
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
        getSubscriptionPlansApi(),
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

  // Get Free and Pro plans
  const freePlan = plans.find((p) => p.name?.toUpperCase() === "FREE" || p.monthlyPrice === 0);
  const proPlan = plans.find((p) => p.name?.toUpperCase() === "PRO" || p.monthlyPrice > 0);

  const isFreeCurrent = currentSubscription?.planId === freePlan?.id && currentSubscription?.status === "ACTIVE";
  const isProCurrent = currentSubscription?.planId === proPlan?.id && currentSubscription?.status === "ACTIVE";

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

      {/* Pricing Cards */}
      <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
        {/* Free Plan Card */}
        {freePlan && (
          <Card className="relative overflow-hidden border-2">
            {isFreeCurrent && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <Badge className="bg-green-500 text-white px-4 py-1 rounded-full">
                  Current Plan
                </Badge>
              </div>
            )}
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-2">{freePlan.name || "Free"}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-green-600">Free</span>
                </div>
                <p className="text-sm text-muted-foreground">Perfect for getting started</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Basic dashboard access</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Up to {formatLimit(freePlan.maxProducts)} products</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Up to {formatLimit(freePlan.maxUsers)} users</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Basic reporting</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Email support</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-not-allowed"
                disabled
              >
                {isFreeCurrent ? "Current Plan" : "Free Plan"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pro Plan Card */}
        {proPlan && (
          <Card className="relative overflow-hidden border-2 border-primary">
            <div className="absolute top-4 right-4 z-10">
              <Badge className="bg-purple-500 text-white px-4 py-1 rounded-full">
                POPULAR
              </Badge>
            </div>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-2">{proPlan.name || "Pro"}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">${parseFloat(proPlan.monthlyPrice || 0).toFixed(2)}</span>
                  <span className="text-muted-foreground text-lg">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">Everything you need to grow your business</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Advanced dashboard access</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Unlimited products</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Unlimited customers</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Advanced reporting & analytics</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Priority support</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{formatLimit(proPlan.maxAiRequestsPerMonth)} AI requests/month</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Custom integrations</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Multi-user support ({formatLimit(proPlan.maxUsers)} users)</span>
                </div>
              </div>

              {isProCurrent ? (
                <Button
                  variant="outline"
                  className="w-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-not-allowed"
                  disabled
                >
                  Current Plan
                </Button>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-6 text-lg"
                  onClick={() => handleSubscribe(proPlan.id)}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Request Pro Upgrade
                </Button>
              )}
            </CardContent>
          </Card>
        )}
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
                {freePlan && "Basic reports"} {proPlan && "Advanced analytics with AI insights"}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">AI Features</h4>
              <p className="text-sm text-muted-foreground">
                {freePlan && "Limited AI requests"} {proPlan && "Unlimited AI-powered insights"}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Support</h4>
              <p className="text-sm text-muted-foreground">
                {freePlan && "Email support"} {proPlan && "Priority 24/7 support"}
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
