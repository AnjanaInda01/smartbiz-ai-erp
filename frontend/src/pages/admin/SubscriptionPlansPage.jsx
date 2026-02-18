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
      price: plan.price,
      durationMonths: plan.durationMonths,
      maxProducts: plan.maxProducts ?? -1,
      maxCustomers: plan.maxCustomers ?? -1,
      maxInvoices: plan.maxInvoices ?? -1,
      maxStaff: plan.maxStaff ?? -1,
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
      if (selectedPlan) {
        await updateSubscriptionPlanApi(selectedPlan.id, data);
        toast.success("Subscription plan updated successfully");
      } else {
        await createSubscriptionPlanApi(data);
        toast.success("Subscription plan created successfully");
      }
      setDialogOpen(false);
      reset();
      loadPlans();
    } catch (error) {
      const message = error.response?.data?.message || "Operation failed";
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
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => row.original.description || "-",
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => `$${row.original.price?.toFixed(2)}/${row.original.durationMonths}mo`,
      },
      {
        accessorKey: "maxProducts",
        header: "Max Products",
        cell: ({ row }) => formatLimit(row.original.maxProducts),
      },
      {
        accessorKey: "maxCustomers",
        header: "Max Customers",
        cell: ({ row }) => formatLimit(row.original.maxCustomers),
      },
      {
        accessorKey: "maxStaff",
        header: "Max Staff",
        cell: ({ row }) => formatLimit(row.original.maxStaff),
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name *</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input id="price" type="number" step="0.01" {...register("price")} />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register("description")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationMonths">Duration (Months) *</Label>
                <Input id="durationMonths" type="number" {...register("durationMonths")} />
                {errors.durationMonths && (
                  <p className="text-sm text-destructive">{errors.durationMonths.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxProducts">Max Products (-1 for unlimited) *</Label>
                  <Input id="maxProducts" type="number" {...register("maxProducts")} />
                  {errors.maxProducts && (
                    <p className="text-sm text-destructive">{errors.maxProducts.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCustomers">Max Customers (-1 for unlimited) *</Label>
                  <Input id="maxCustomers" type="number" {...register("maxCustomers")} />
                  {errors.maxCustomers && (
                    <p className="text-sm text-destructive">{errors.maxCustomers.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxInvoices">Max Invoices (-1 for unlimited) *</Label>
                  <Input id="maxInvoices" type="number" {...register("maxInvoices")} />
                  {errors.maxInvoices && (
                    <p className="text-sm text-destructive">{errors.maxInvoices.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStaff">Max Staff (-1 for unlimited) *</Label>
                  <Input id="maxStaff" type="number" {...register("maxStaff")} />
                  {errors.maxStaff && (
                    <p className="text-sm text-destructive">{errors.maxStaff.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="active"
                  checked={activeValue}
                  onCheckedChange={(checked) => setValue("active", checked === true)}
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Active
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
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
