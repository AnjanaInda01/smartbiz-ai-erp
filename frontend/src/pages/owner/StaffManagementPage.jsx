import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getStaffApi, createStaffApi, updateStaffApi, deleteStaffApi } from "@/api/staffApi";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Users } from "lucide-react";

const staffSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Name must be max 120 characters"),
  email: z.string().email("Invalid email").max(150, "Email must be max 150 characters"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  phone: z.string().max(30, "Phone must be max 30 characters").optional().or(z.literal("")),
});

export default function StaffManagementPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(staffSchema),
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const res = await getStaffApi();
      setStaff(res.data || []);
    } catch (error) {
      toast.error("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedStaff(null);
    reset();
    setDialogOpen(true);
  };

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    reset({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone || "",
      password: "", // Don't pre-fill password
    });
    setDialogOpen(true);
  };

  const handleDelete = (staffMember) => {
    setSelectedStaff(staffMember);
    setDeleteDialogOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      const staffData = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        ...(data.password && data.password.length > 0 ? { password: data.password } : {}),
      };

      if (selectedStaff) {
        await updateStaffApi(selectedStaff.id, staffData);
        toast.success("Staff member updated successfully");
      } else {
        if (!data.password || data.password.length < 6) {
          toast.error("Password is required for new staff members");
          return;
        }
        await createStaffApi(staffData);
        toast.success("Staff member created successfully");
      }
      setDialogOpen(false);
      reset();
      loadStaff();
    } catch (error) {
      const message = error.response?.data?.message || "Operation failed";
      toast.error(message);
    }
  };

  const onDelete = async () => {
    try {
      await deleteStaffApi(selectedStaff.id);
      toast.success("Staff member deleted successfully");
      setDeleteDialogOpen(false);
      loadStaff();
    } catch (error) {
      toast.error("Failed to delete staff member");
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => row.original.phone || "-",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original)}
            >
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
        title="Staff Management"
        description="Manage your staff members and their access"
        action={
          <Button onClick={handleCreate} className="animate-scale-in shadow-md hover:shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-12 animate-fade-in">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="animate-slide-up">
          <DataTable columns={columns} data={staff} searchKey="name" />
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedStaff ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
            <DialogDescription>
              {selectedStaff ? "Update staff member information" : "Add a new staff member to your business"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
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
                <Label htmlFor="password">
                  {selectedStaff ? "New Password (leave blank to keep current)" : "Password *"}
                </Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{selectedStaff ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={onDelete}
        title="Delete Staff Member"
        description={`Are you sure you want to delete "${selectedStaff?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
