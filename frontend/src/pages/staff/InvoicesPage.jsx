import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getInvoicesApi, createInvoiceApi } from "@/api/invoiceApi";
import { getCustomersApi } from "@/api/customerApi";
import { getProductsApi } from "@/api/productApi";
import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Eye, Trash2 } from "lucide-react";

const invoiceSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  invoiceDate: z.string().min(1, "Date is required"),
  discount: z.coerce.number().min(0, "Discount must be >= 0"),
});

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [items, setItems] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceDate: new Date().toISOString().split("T")[0],
      discount: 0,
    },
  });

  const customerId = watch("customerId");
  const discount = watch("discount") || 0;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [invoicesRes, customersRes, productsRes] = await Promise.all([
        getInvoicesApi(),
        getCustomersApi(),
        getProductsApi(),
      ]);
      setInvoices(invoicesRes.data || []);
      setCustomers(customersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    reset({
      customerId: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      discount: 0,
    });
    setItems([]);
    setDialogOpen(true);
  };

  const addItem = () => {
    setItems([...items, { productId: "", qty: 1 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotals = () => {
    let subTotal = 0;
    items.forEach((item) => {
      const product = products.find((p) => p.id === parseInt(item.productId));
      if (product && product.unitPrice != null) {
        subTotal += (product.unitPrice || 0) * (item.qty || 0);
      }
    });
    const discountAmount = discount || 0;
    const grandTotal = Math.max(0, subTotal - discountAmount);
    return { subTotal, discountAmount, grandTotal };
  };

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    const invalidItems = items.filter(
      (item) => !item.productId || !item.qty || item.qty < 1
    );
    if (invalidItems.length > 0) {
      toast.error("Please fill all item fields correctly");
      return;
    }

    try {
      await createInvoiceApi({
        customerId: parseInt(data.customerId),
        invoiceDate: data.invoiceDate,
        discount: data.discount,
        items: items.map((item) => ({
          productId: parseInt(item.productId),
          qty: parseInt(item.qty),
        })),
      });
      toast.success("Invoice created successfully");
      setDialogOpen(false);
      reset();
      setItems([]);
      loadData();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create invoice";
      toast.error(message);
    }
  };

  const { subTotal, discountAmount, grandTotal } = calculateTotals();

  const columns = useMemo(
    () => [
      {
        accessorKey: "invoiceNo",
        header: "Invoice #",
      },
      {
        accessorKey: "invoiceDate",
        header: "Date",
      },
      {
        accessorKey: "customerName",
        header: "Customer",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.original.status === "CONFIRMED" ? "default" : "secondary"}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "grandTotal",
        header: "Total",
        cell: ({ row }) => `$${row.original.grandTotal?.toFixed(2) || 0}`,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/staff/invoices/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Invoices"
        description="Manage invoices"
        action={
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        }
      />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={columns} data={invoices} searchKey="invoiceNo" />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} className="max-w-4xl">
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>Create a new invoice with items</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer *</Label>
                  <Select
                    value={customerId || ""}
                    onValueChange={(value) => setValue("customerId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.customerId && (
                    <p className="text-sm text-destructive">{errors.customerId.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">Invoice Date *</Label>
                  <Input id="invoiceDate" type="date" {...register("invoiceDate")} />
                  {errors.invoiceDate && (
                    <p className="text-sm text-destructive">{errors.invoiceDate.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Items</Label>
                <Button type="button" variant="outline" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
                {items.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => {
                        const product = products.find((p) => p.id === parseInt(item.productId));
                        const lineTotal = product ? product.unitPrice * (item.qty || 0) : 0;
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <Select
                                value={item.productId}
                                onValueChange={(value) => updateItem(index, "productId", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                  {products.map((p) => (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                      {p.name} (${p.unitPrice?.toFixed(2)})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={item.qty || ""}
                                onChange={(e) => updateItem(index, "qty", parseInt(e.target.value) || 1)}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>${product?.unitPrice?.toFixed(2) || "0.00"}</TableCell>
                            <TableCell>${lineTotal.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount</Label>
                <Input id="discount" type="number" step="0.01" min="0" {...register("discount")} />
                {errors.discount && (
                  <p className="text-sm text-destructive">{errors.discount.message}</p>
                )}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Grand Total:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Invoice</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
