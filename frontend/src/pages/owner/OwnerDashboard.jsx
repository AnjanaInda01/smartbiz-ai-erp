import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PaymentsIcon from "@mui/icons-material/Payments";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { LineChart } from "@mui/x-charts/LineChart";

function StatCard({ title, value, subtitle, icon, accent = "primary" }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(900px circle at 20% 0%, ${alpha(
            theme.palette[accent].main,
            0.18,
          )} 0%, transparent 45%)`,
          pointerEvents: "none",
        }}
      />
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={700}>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(theme.palette[accent].main, 0.14),
              color: theme.palette[accent].main,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function OwnerDashboard() {
  const theme = useTheme();

  // demo data (replace later with API)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const sales = [12, 18, 9, 26, 34, 21, 40]; // LKR (x1000 for example)

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4">Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Overview of sales, customers, and inventory
          </Typography>
        </Box>

        <Card
          sx={{
            px: 2,
            py: 1.2,
            borderRadius: 4,
            bgcolor: alpha(theme.palette.primary.main, 0.06),
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <TrendingUpIcon fontSize="small" />
            <Typography variant="body2" fontWeight={800}>
              This week +12%
            </Typography>
          </Stack>
        </Card>
      </Stack>

      <Grid container spacing={2.2}>
        {/* KPI row */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sales Today"
            value="LKR 0.00"
            subtitle="Realtime"
            icon={<PaymentsIcon />}
            accent="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Sales This Month"
            value="LKR 0.00"
            subtitle="Monthly"
            icon={<PaymentsIcon />}
            accent="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Customers"
            value="0"
            subtitle="Active"
            icon={<PeopleAltIcon />}
            accent="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Low Stock"
            value="0"
            subtitle="Stock < 10"
            icon={<Inventory2Icon />}
            accent="error"
          />
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={0.5} sx={{ mb: 2 }}>
                <Typography fontWeight={900}>Sales Trend</Typography>
                <Typography variant="body2" color="text.secondary">
                  Weekly performance (demo)
                </Typography>
              </Stack>

              <Box sx={{ height: 320 }}>
                <LineChart
                  xAxis={[{ scaleType: "point", data: days }]}
                  series={[
                    {
                      data: sales,
                      label: "Sales",
                      area: true,
                    },
                  ]}
                  height={320}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, height: "100%" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography fontWeight={900}>Quick Actions</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Common tasks
              </Typography>

              <Stack spacing={1.2}>
                <Card sx={{ p: 1.6, borderRadius: 3 }}>
                  <Typography fontWeight={800}>+ Add Product</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create new inventory item
                  </Typography>
                </Card>
                <Card sx={{ p: 1.6, borderRadius: 3 }}>
                  <Typography fontWeight={800}>+ Create Invoice</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bill a customer quickly
                  </Typography>
                </Card>
                <Card sx={{ p: 1.6, borderRadius: 3 }}>
                  <Typography fontWeight={800}>Restock Purchase</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Update low stock items
                  </Typography>
                </Card>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
