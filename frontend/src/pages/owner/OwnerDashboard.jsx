import { Box, Grid, Paper, Typography } from "@mui/material";

function Card({ title, value, sub }) {
  return (
    <Paper sx={{ p: 2.2, borderRadius: 3 }}>
      <Typography variant="body2" sx={{ opacity: 0.7 }}>{title}</Typography>
      <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>{value}</Typography>
      {sub ? <Typography variant="caption" sx={{ opacity: 0.65 }}>{sub}</Typography> : null}
    </Paper>
  );
}

export default function OwnerDashboard() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}><Card title="Sales Today" value="LKR 0.00" sub="Realtime" /></Grid>
        <Grid item xs={12} sm={6} md={3}><Card title="Sales This Month" value="LKR 0.00" /></Grid>
        <Grid item xs={12} sm={6} md={3}><Card title="Total Customers" value="0" /></Grid>
        <Grid item xs={12} sm={6} md={3}><Card title="Low Stock Products" value="0" sub="stock < 10" /></Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2.2, borderRadius: 3, height: 320 }}>
            <Typography fontWeight={900}>Sales Trend</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Next: connect /reports endpoints for daily/monthly chart
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2.2, borderRadius: 3, height: 320 }}>
            <Typography fontWeight={900}>Quick Actions</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
              • Add Product<br/>
              • Create Invoice<br/>
              • Restock Purchase<br/>
              • Add Supplier
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
