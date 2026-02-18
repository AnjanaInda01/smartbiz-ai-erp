import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  User,
  Crown,
  Building2,
  Brain,
  BarChart3,
  Truck,
  ShoppingCart,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { normalizeRole } from "@/auth/roleRedirect";

const sidebarItems = {
  owner: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/owner" },
    { icon: TrendingUp, label: "Sales", path: "/owner/sales" },
    { icon: Package, label: "Products", path: "/owner/products" },
    { icon: Users, label: "Customers", path: "/owner/customers" },
    { icon: Truck, label: "Suppliers", path: "/owner/suppliers" },
    { icon: FileText, label: "Invoices", path: "/owner/invoices" },
    { icon: ShoppingCart, label: "Purchases", path: "/owner/purchases" },
    { icon: BarChart3, label: "Reports", path: "/owner/reports" },
    { icon: Brain, label: "AI Insights", path: "/owner/ai-insights" },
    { icon: Crown, label: "Subscription", path: "/owner/subscription" },
  ],
  staff: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/staff" },
    { icon: Package, label: "Products", path: "/staff/products" },
    { icon: FileText, label: "Invoices", path: "/staff/invoices" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Building2, label: "Businesses", path: "/admin/businesses" },
    { icon: Brain, label: "AI Usage & Logs", path: "/admin/ai-usage" },
    { icon: BarChart3, label: "System Statistics", path: "/admin/statistics" },
    { icon: Crown, label: "Subscription Plans", path: "/admin/subscription-plans" },
  ],
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const role = normalizeRole(user?.role || "");
  const items = sidebarItems[role.toLowerCase()] || [];

  // Mock notifications - in a real app, this would come from an API
  const notifications = useMemo(() => [
    {
      id: 1,
      type: "info",
      title: "Welcome to SmartBiz ERP",
      message: "Your system is running smoothly",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "success",
      title: "Subscription Active",
      message: "Your subscription plan is active",
      time: "1 day ago",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Low Stock Alert",
      message: "Some products are running low on stock",
      time: "2 days ago",
      read: true,
    },
  ], []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const filtered = items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchSelect = (path) => {
    navigate(path);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-xl font-semibold">SmartBiz ERP</h2>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r bg-card lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search menu items..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              />
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                  {searchResults.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleSearchSelect(item.path)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent text-left transition-colors first:rounded-t-md last:rounded-b-md"
                      >
                        <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <span className="text-base">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {showSearchResults && searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-md shadow-lg z-50 p-4 text-center text-base text-muted-foreground">
                  No results found
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative flex-shrink-0">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span className="text-base">Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadCount} new
                    </Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const Icon =
                        notification.type === "success"
                          ? CheckCircle2
                          : notification.type === "warning"
                          ? AlertCircle
                          : Info;
                      const iconColor =
                        notification.type === "success"
                          ? "text-green-600"
                          : notification.type === "warning"
                          ? "text-yellow-600"
                          : "text-blue-600";
                      return (
                        <div
                          key={notification.id}
                          className={cn(
                            "px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0",
                            !notification.read && "bg-accent/50"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", iconColor)} />
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-medium">{notification.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center">
                      View all notifications
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 flex-shrink-0">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline text-base">{user?.name || "User"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
