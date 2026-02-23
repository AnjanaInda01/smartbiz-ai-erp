import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  createCustomerApi,
  deleteCustomerApi,
  getCustomersApi,
  updateCustomerApi,
} from "@/api/customerApi";
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
import { Plus, Pencil, Trash2 } from "lucide-react";

const customerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(120, "Name must be max 120 characters"),
  email: z
    .string()
    .email("Invalid email")
    .max(150, "Email must be max 150 characters")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(30, "Phone must be max 30 characters")
    .optional()
    .or(z.literal("")),
  active: z.boolean().optional(),
});

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: { active: true },
  });

  const activeValue = watch("active");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomersApi();
      setCustomers(res.data || []);
    } catch (error) {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCustomer(null);
    reset({ active: true });
    setDialogOpen(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    reset({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      active: customer.active !== false,
    });
    setDialogOpen(true);
  };

  const handleDelete = (customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (selectedCustomer) {
        await updateCustomerApi(selectedCustomer.id, data);
        toast.success("Customer updated successfully");
      } else {
        await createCustomerApi(data);
        toast.success("Customer created successfully");
      }
      setDialogOpen(false);
      reset();
      loadCustomers();
    } catch (error) {
      const message = error.response?.data?.message || "Operation failed";
      toast.error(message);
    }
  };

  const onDelete = async () => {
    try {
      await deleteCustomerApi(selectedCustomer.id);
      toast.success("Customer deleted successfully");
      setDeleteDialogOpen(false);
      loadCustomers();
    } catch (error) {
      toast.error("Failed to delete customer");
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Phone" },
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
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Customers"
        description="Manage customers"
        action={
          <Button onClick={handleCreate} className="animate-scale-in shadow-md hover:shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-12 animate-fade-in">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="animate-slide-up">
          <DataTable columns={columns} data={customers} searchKey="name" />
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCustomer ? "Edit Customer" : "Create Customer"}</DialogTitle>
            <DialogDescription>
              {selectedCustomer ? "Update customer information" : "Add a new customer"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
              {selectedCustomer && (
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
              )}
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
        title="Delete Customer"
        description={`Are you sure you want to delete "${selectedCustomer?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

