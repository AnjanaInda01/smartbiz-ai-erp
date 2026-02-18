import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getBusinessesApi, createBusinessApi } from "@/api/businessApi";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Building2, Mail, Phone, MapPin, Plus, Crown } from "lucide-react";

const businessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    free: 0,
    pro: 0,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(businessSchema),
  });

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const res = await getBusinessesApi();
      const data = res.data || [];
      setBusinesses(data);
      
      const freeCount = data.filter((b) => b.subscriptionPlan?.toUpperCase() === "FREE").length;
      const proCount = data.filter((b) => b.subscriptionPlan?.toUpperCase() === "PRO").length;
      
      setStats({
        total: data.length,
        free: freeCount,
        pro: proCount,
      });
    } catch (error) {
      toast.error("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    reset();
    setDialogOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      await createBusinessApi(data);
      toast.success("Business created successfully");
      setDialogOpen(false);
      reset();
      loadBusinesses();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create business";
      toast.error(message);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "name",
        header: "Business Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{row.original.email || "-"}</span>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{row.original.phone || "-"}</span>
          </div>
        ),
      },
      {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="max-w-xs truncate">{row.original.address || "-"}</span>
          </div>
        ),
      },
      {
        accessorKey: "subscriptionPlan",
        header: "Subscription Plan",
        cell: ({ row }) => {
          const plan = row.original.subscriptionPlan;
          const status = row.original.subscriptionStatus;
          if (!plan) {
            return (
              <Badge variant="outline" className="flex items-center gap-1 w-fit">
                <span>No Plan</span>
              </Badge>
            );
          }
          const isPro = plan.toUpperCase() === "PRO";
          const isActive = status === "ACTIVE";
          return (
            <Badge
              variant={isPro ? "default" : "secondary"}
              className={`flex items-center gap-1 w-fit ${isPro ? "bg-primary" : ""}`}
            >
              {isPro && <Crown className="h-3 w-3" />}
              <span>{plan}</span>
              {!isActive && (
                <span className="ml-1 text-xs opacity-75">({status})</span>
              )}
            </Badge>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Registered Businesses"
        description="View and manage all registered businesses in the system"
        action={
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Business
          </Button>
        }
      />

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Businesses</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm text-muted-foreground">Free Plan</p>
                <p className="text-2xl font-bold">{stats.free}</p>
              </div>
              <Badge variant="secondary" className="h-8 px-3 flex items-center">
                FREE
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm text-muted-foreground">Pro Plan</p>
                <p className="text-2xl font-bold">{stats.pro}</p>
              </div>
              <Badge variant="default" className="h-8 px-3 flex items-center gap-1 bg-primary">
                <Crown className="h-3 w-3" />
                PRO
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Businesses Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Businesses</CardTitle>
          <CardDescription>List of all registered businesses</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : businesses.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Building2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No businesses registered yet</p>
            </div>
          ) : (
            <DataTable columns={columns} data={businesses} searchKey="name" />
          )}
        </CardContent>
      </Card>

      {/* Create Business Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Business</DialogTitle>
            <DialogDescription>
              Add a new business to the system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name *</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register("address")} />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Business</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
