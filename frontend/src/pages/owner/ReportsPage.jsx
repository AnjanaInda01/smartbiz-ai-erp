import { useState, useEffect, useRef } from "react";
import { getDashboardReportApi } from "@/api/reportApi";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  Calendar,
  BarChart3,
  Download,
  Printer,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const res = await getDashboardReportApi();
      setReport(res.data);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!reportRef.current) return;

    const printWindow = window.open("", "_blank", "width=1024,height=768");
    if (!printWindow) {
      toast.error("Please allow popups to print the report");
      return;
    }

    const reportHtml = reportRef.current.innerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>SmartBiz Summary Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
            h1 { font-size: 24px; margin-bottom: 6px; }
            p { margin: 0 0 12px; color: #6b7280; }
            .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
            .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; break-inside: avoid; }
            .value { font-size: 22px; font-weight: 700; margin-top: 6px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .muted { color: #6b7280; font-size: 14px; }
            .section { margin-top: 16px; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <h1>SmartBiz Summary Report</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          <div>${reportHtml}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    try {
      setExportingPdf(true);
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const imgWidth = pdfWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let remainingHeight = imgHeight;
      let y = margin;

      pdf.setFontSize(16);
      pdf.text("SmartBiz Summary Report", margin, y);
      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, y + 6);
      y += 10;

      pdf.addImage(imageData, "PNG", margin, y, imgWidth, imgHeight);
      remainingHeight -= (pdfHeight - y - margin);

      while (remainingHeight > 0) {
        pdf.addPage();
        const pageY = margin - (imgHeight - remainingHeight);
        pdf.addImage(imageData, "PNG", margin, pageY, imgWidth, imgHeight);
        remainingHeight -= (pdfHeight - margin * 2);
      }

      pdf.save(`smartbiz-summary-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.error("Failed to generate PDF");
    } finally {
      setExportingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <BarChart3 className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>No report data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Sales Reports & Summaries"
        description="View your business performance and analytics"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownloadPdf} disabled={exportingPdf}>
              {exportingPdf ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Download PDF
            </Button>
          </div>
        }
      />

      <div ref={reportRef} className="space-y-6">
      {/* Sales Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Today's Sales</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ${parseFloat(report.todaySales || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Sales today</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent" style={{ animationDelay: "100ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Month's Sales</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ${parseFloat(report.monthSales || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent" style={{ animationDelay: "200ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Today's Profit</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ${parseFloat(report.todayProfit || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Profit today</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up hover:shadow-xl transition-premium bg-gradient-to-br from-primary/5 to-transparent" style={{ animationDelay: "300ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Month's Profit</CardTitle>
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ${parseFloat(report.monthProfit || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 animate-fade-in">
        <Card className="animate-slide-up hover:shadow-xl transition-premium shadow-premium">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Business Overview</CardTitle>
            <CardDescription className="text-base">Key metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 transition-premium hover:bg-accent">
              <span className="text-base text-muted-foreground">Total Customers</span>
              <span className="text-xl font-bold text-primary">{report.totalCustomers}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 transition-premium hover:bg-accent">
              <span className="text-base text-muted-foreground">Total Products</span>
              <span className="text-xl font-bold text-primary">{report.totalProducts}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up hover:shadow-xl transition-premium shadow-premium" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>Products running low</CardDescription>
          </CardHeader>
          <CardContent>
            {report.lowStockProducts && report.lowStockProducts.length > 0 ? (
              <div className="space-y-2">
                {report.lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                    </div>
                    <Badge variant="destructive">
                      <Package className="h-3 w-3 mr-1" />
                      {product.stockQty} left
                    </Badge>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link to="/owner/products">Manage Products</Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">All products are well stocked</p>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
