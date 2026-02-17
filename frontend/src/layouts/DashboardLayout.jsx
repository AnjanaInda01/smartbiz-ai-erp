import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 270;

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const role = user?.role;

  const nav = useNavigate();
  const loc = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = useMemo(() => {
    if (role === "OWNER") {
      return [
        { label: "Dashboard", path: "/owner", icon: <DashboardIcon /> },
        { label: "Products", path: "/owner/products", icon: <Inventory2Icon /> },
        { label: "Customers", path: "/owner/customers", icon: <PeopleIcon /> },
        { label: "Invoices", path: "/owner/invoices", icon: <ReceiptLongIcon /> },
        { label: "AI Assistant", path: "/owner/ai", icon: <SmartToyIcon /> },
      ];
    }
    if (role === "STAFF") {
      return [
        { label: "Dashboard", path: "/staff", icon: <DashboardIcon /> },
        { label: "Products", path: "/staff/products", icon: <Inventory2Icon /> },
        { label: "Invoices", path: "/staff/invoices", icon: <ReceiptLongIcon /> },
      ];
    }
    if (role === "ADMIN") {
      return [
        { label: "Admin Dashboard", path: "/admin", icon: <AdminPanelSettingsIcon /> },
        { label: "Businesses", path: "/admin/businesses", icon: <PeopleIcon /> },
        { label: "Plans", path: "/admin/plans", icon: <ReceiptLongIcon /> },
        { label: "AI Usage", path: "/admin/ai-usage", icon: <SmartToyIcon /> },
      ];
    }
    return [];
  }, [role]);

  const title = useMemo(() => {
    if (role === "OWNER") return "Owner Panel";
    if (role === "STAFF") return "Staff Panel";
    if (role === "ADMIN") return "Admin Panel";
    return "Dashboard";
  }, [role]);

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2, py: 2 }}>
        <Typography fontWeight={900} fontSize={18}>SmartBiz</Typography>
        <Typography variant="body2" sx={{ opacity: 0.75 }}>
          {user?.email}
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1, pt: 1 }}>
        {menu.map((item) => {
          const selected = loc.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                nav(item.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                mb: 0.6,
                "&.Mui-selected": { backgroundColor: "rgba(25, 118, 210, 0.12)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={() => {
            logout();
            nav("/login");
          }}
          sx={{ borderRadius: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed" elevation={0} sx={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: "none" } }}
            edge="start"
            color="inherit"
          >
            <MenuIcon />
          </IconButton>

          <Typography fontWeight={900}>{title}</Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {user?.name} • {role}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        {drawer}
      </Drawer>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
