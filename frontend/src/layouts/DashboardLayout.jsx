import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";

import { useAuth } from "../auth/AuthProvider";

const DRAWER_WIDTH = 292;

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const role = (user?.role || "").toString().toUpperCase().replace("ROLE_", "");
  const basePath =
    role === "ADMIN" ? "/admin" : role === "STAFF" ? "/staff" : "/owner";

  const navItems = useMemo(() => {
    const common = [{ label: "Dashboard", path: `${basePath}`, icon: <DashboardIcon /> }];

    if (basePath === "/owner") {
      return [
        ...common,
        { label: "Products", path: `${basePath}/products`, icon: <Inventory2Icon /> },
        { label: "Customers", path: `${basePath}/customers`, icon: <PeopleAltIcon /> },
        { label: "Invoices", path: `${basePath}/invoices`, icon: <ReceiptLongIcon /> },
        { label: "AI Assistant", path: `${basePath}/ai`, icon: <SmartToyIcon /> },
      ];
    }

    if (basePath === "/staff") {
      return [
        ...common,
        { label: "Products", path: `${basePath}/products`, icon: <Inventory2Icon /> },
        { label: "Invoices", path: `${basePath}/invoices`, icon: <ReceiptLongIcon /> },
      ];
    }

    return [...common];
  }, [basePath]);

  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const handleDrawerToggle = () => setMobileOpen((v) => !v);

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        px: 2,
        py: 2,
        color: "common.white",
        background: "linear-gradient(180deg, #0B1220 0%, #111B2E 55%, #0B1220 100%)",
      }}
    >
      {/* Brand */}
      <Stack spacing={1} sx={{ px: 1, pt: 0.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: "linear-gradient(135deg, #60A5FA 0%, #2563EB 60%, #1D4ED8 100%)",
              boxShadow: `0 10px 25px ${alpha("#2563EB", 0.35)}`,
            }}
          />
          <Box>
            <Typography variant="h6" fontWeight={900} lineHeight={1.1}>
              SmartBiz ERP
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>
              {role || "USER"} • {user?.email || ""}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Divider sx={{ my: 2, borderColor: alpha("#fff", 0.12) }} />

      {/* Quick search (UI only) */}
      <Box
        sx={{
          mx: 1,
          mb: 2,
          px: 1.5,
          py: 1,
          borderRadius: 2,
          backgroundColor: alpha("#fff", 0.06),
          border: `1px solid ${alpha("#fff", 0.08)}`,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <SearchIcon sx={{ fontSize: 18, opacity: 0.8 }} />
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Search…
        </Typography>
      </Box>

      {/* Nav */}
      <List sx={{ px: 0.5 }}>
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== basePath && location.pathname.startsWith(item.path));

          return (
            <ListItemButton
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                mb: 0.8,
                borderRadius: 2.5,
                position: "relative",
                color: "common.white",
                backgroundColor: isActive ? alpha("#60A5FA", 0.16) : "transparent",
                border: `1px solid ${isActive ? alpha("#60A5FA", 0.22) : "transparent"}`,
                "&:hover": {
                  backgroundColor: alpha("#60A5FA", 0.14),
                },
                "&::before": isActive
                  ? {
                      content: '""',
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 8,
                      height: 8,
                      borderRadius: 99,
                      background: "#60A5FA",
                      boxShadow: `0 0 0 4px ${alpha("#60A5FA", 0.18)}`,
                    }
                  : {},
              }}
            >
              <ListItemIcon sx={{ minWidth: 42, color: alpha("#fff", 0.9) }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 900 : 700,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Footer card */}
      <Box
        sx={{
          mt: 2,
          p: 1.5,
          borderRadius: 3,
          backgroundColor: alpha("#fff", 0.06),
          border: `1px solid ${alpha("#fff", 0.08)}`,
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Avatar sx={{ fontWeight: 900, bgcolor: alpha("#60A5FA", 0.22), color: "white" }}>
            {initials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap fontWeight={900}>
              {user?.name || "User"}
            </Typography>
            <Chip
              size="small"
              label={role || "ROLE"}
              sx={{
                mt: 0.5,
                fontWeight: 800,
                color: "white",
                borderColor: alpha("#fff", 0.18),
              }}
              variant="outlined"
            />
          </Box>
        </Stack>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          sx={{
            mt: 1.5,
            borderRadius: 2,
            fontWeight: 900,
            color: "white",
            borderColor: alpha("#fff", 0.22),
            "&:hover": { borderColor: alpha("#fff", 0.32), backgroundColor: alpha("#fff", 0.06) },
          }}
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: alpha("#fff", 0.75),
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${alpha("#000", 0.06)}`,
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          {isMobile && (
            <IconButton edge="start" onClick={handleDrawerToggle} aria-label="open drawer">
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="subtitle1" fontWeight={900} sx={{ flexGrow: 1 }}>
            {role === "OWNER" ? "Owner Panel" : role === "ADMIN" ? "Admin Panel" : "Staff Panel"}
          </Typography>

          <Tooltip title="Notifications">
            <IconButton>
              <Badge variant="dot" color="primary">
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, border: 0 },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { width: DRAWER_WIDTH, border: 0 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          pt: 10,
          px: { xs: 2, sm: 3 },
          pb: 4,
        }}
      >
        <Box sx={{ maxWidth: 1250, mx: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
