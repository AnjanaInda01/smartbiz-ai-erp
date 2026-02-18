import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  getSubscriptionPlansApi,
  createSubscriptionPlanApi,
  updateSubscriptionPlanApi,
  deleteSubscriptionPlanApi,
} from "@/api/subscriptionApi";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Crown } from "lucide-react";

const subscriptionPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be >= 0"),
  durationMonths: z.coerce.number().min(1, "Duration must be >= 1"),
  maxProducts: z.coerce.number().min(-1, "Max products must be >= -1 (-1 for unlimited)"),
  maxCustomers: z.coerce.number().min(-1, "Max customers must be >= -1 (-1 for unlimited)"),
  maxInvoices: z.coerce.number().min(-1, "Max invoices must be >= -1 (-1 for unlimited)"),
  maxStaff: z.coerce.number().min(-1, "Max staff must be >= -1 (-1 for unlimited)"),
  active: z.boolean().optional(),
});

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues: {
      active: true,
      maxProducts: -1,
      maxCustomers: -1,
      maxInvoices: -1,
      maxStaff: -1,
    },
  });

  const activeValue = watch("active");

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await getSubscriptionPlansApi();
      setPlans(res.data || []);
    } catch (error) {
      toast.error("Failed to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPlan(null);
    reset({
      active: true,
      maxProducts: -1,
      maxCustomers: -1,
      maxInvoices: -1,
      maxStaff: -1,
    });
    setDialogOpen(true);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    reset({
      name: plan.name,
      description: plan.description || "",
      price: plan.monthlyPrice || 0,
      durationMonths: 1, // Default to 1 month
      maxProducts: plan.maxProducts ?? -1,
      maxCustomers: plan.maxAiRequestsPerMonth ?? 0, // Map AI requests to customers field for display
      maxInvoices: -1, // Not in backend, default to unlimited
      maxStaff: plan.maxUsers ?? -1,
      active: plan.active !== false,
    });
    setDialogOpen(true);
  };

  const handleDelete = (plan) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      // Map frontend form data to backend entity structure
      const planData = {
        name: data.name,
        monthlyPrice: parseFloat(data.price || 0),
        maxUsers: parseInt(data.maxStaff || -1), // Using maxStaff as maxUsers
        maxProducts: parseInt(data.maxProducts || -1),
        maxAiRequestsPerMonth: parseInt(data.maxCustomers || 0), // Map customers to AI requests for now
        active: data.active !== false,
      };

      if (selectedPlan) {
        await updateSubscriptionPlanApi(selectedPlan.id, planData);
        toast.success("Subscription plan updated successfully");
      } else {
        await createSubscriptionPlanApi(planData);
        toast.success("Subscription plan created successfully");
      }
      setDialogOpen(false);
      reset();
      loadPlans();
    } catch (error) {
      console.error("Subscription plan error:", error);
      const message = error.response?.data?.message || error.message || "Operation failed";
      toast.error(message);
    }
  };

  const onDelete = async () => {
    try {
      await deleteSubscriptionPlanApi(selectedPlan.id);
      toast.success("Subscription plan deleted successfully");
      setDeleteDialogOpen(false);
      loadPlans();
    } catch (error) {
      toast.error("Failed to delete subscription plan");
    }
  };

  const formatLimit = (value) => {
    return value === -1 || value === null ? "Unlimited" : value.toLocaleString();
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Plan Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-primary" />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "monthlyPrice",
        header: "Price",
        cell: ({ row }) => `$${parseFloat(row.original.monthlyPrice || 0).toFixed(2)}/month`,
      },
      {
        accessorKey: "maxProducts",
        header: "Max Products",
        cell: ({ row }) => formatLimit(row.original.maxProducts),
      },
      {
        accessorKey: "maxUsers",
        header: "Max Users",
        cell: ({ row }) => formatLimit(row.original.maxUsers),
      },
      {
        accessorKey: "maxAiRequestsPerMonth",
        header: "AI Requests/Month",
        cell: ({ row }) => formatLimit(row.original.maxAiRequestsPerMonth),
      },
      {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.active ? "default" : "secondary"}>
            {row.original.active ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Plans"
        description="Manage subscription plans for businesses"
        action={
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        }
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={plans} searchKey="name" />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPlan ? "Edit Subscription Plan" : "Create Subscription Plan"}</DialogTitle>
            <DialogDescription>
              {selectedPlan ? "Update subscription plan details" : "Create a new subscription plan"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              {/* Plan Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Plan Name <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="name" 
                  placeholder="e.g., Free, Pro, Enterprise"
                  {...register("name")} 
                  className="w-full"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price ($) <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  placeholder="0.00"
                  {...register("price")} 
                  className="w-full"
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Monthly subscription price</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Describe the features and benefits of this plan..."
                  {...register("description")}
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="durationMonths">
                  Duration (Months) <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="durationMonths" 
                  type="number" 
                  min="1"
                  placeholder="1"
                  {...register("durationMonths")} 
                  className="w-full"
                />
                {errors.durationMonths && (
                  <p className="text-sm text-destructive">{errors.durationMonths.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Billing cycle duration in months</p>
              </div>

              {/* Max Products */}
              <div className="space-y-2">
                <Label htmlFor="maxProducts">
                  Max Products (-1 for unlimited) <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="maxProducts" 
                  type="number" 
                  min="-1"
                  placeholder="-1"
                  {...register("maxProducts")} 
                  className="w-full"
                />
                {errors.maxProducts && (
                  <p className="text-sm text-destructive">{errors.maxProducts.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Maximum number of products allowed. Use -1 for unlimited.</p>
              </div>

              {/* Max Customers */}
              <div className="space-y-2">
                <Label htmlFor="maxCustomers">
                  Max Customers (-1 for unlimited) <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="maxCustomers" 
                  type="number" 
                  min="-1"
                  placeholder="-1"
                  {...register("maxCustomers")} 
                  className="w-full"
                />
                {errors.maxCustomers && (
                  <p className="text-sm text-destructive">{errors.maxCustomers.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Maximum number of customers allowed. Use -1 for unlimited.</p>
              </div>

              {/* Max Invoices */}
              <div className="space-y-2">
                <Label htmlFor="maxInvoices">
                  Max Invoices (-1 for unlimited) <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="maxInvoices" 
                  type="number" 
                  min="-1"
                  placeholder="-1"
                  {...register("maxInvoices")} 
                  className="w-full"
                />
                {errors.maxInvoices && (
                  <p className="text-sm text-destructive">{errors.maxInvoices.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Maximum number of invoices allowed. Use -1 for unlimited.</p>
              </div>

              {/* Max Staff */}
              <div className="space-y-2">
                <Label htmlFor="maxStaff">
                  Max Staff (-1 for unlimited) <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="maxStaff" 
                  type="number" 
                  min="-1"
                  placeholder="-1"
                  {...register("maxStaff")} 
                  className="w-full"
                />
                {errors.maxStaff && (
                  <p className="text-sm text-destructive">{errors.maxStaff.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Maximum number of staff members allowed. Use -1 for unlimited.</p>
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="active"
                  checked={activeValue}
                  onCheckedChange={(checked) => setValue("active", checked === true)}
                />
                <Label htmlFor="active" className="cursor-pointer font-normal">
                  Active
                </Label>
                <p className="text-xs text-muted-foreground ml-2">
                  Active plans are available for subscription
                </p>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="min-w-[100px]"
              >
                {selectedPlan ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={onDelete}
        title="Delete Subscription Plan"
        description={`Are you sure you want to delete "${selectedPlan?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
