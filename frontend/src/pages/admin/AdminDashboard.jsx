import { Box, Grid, Paper, Typography } from "@mui/material";

function Card({ title, value }) {
  return (
    <Paper sx={{ p: 2.2, borderRadius: 3 }}>
      <Typography variant="body2" sx={{ opacity: 0.7 }}>{title}</Typography>
      <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>{value}</Typography>
    </Paper>
  );
}

export default function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
        Admin Overview
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}><Card title="Total Businesses" value="0" /></Grid>
        <Grid item xs={12} sm={6} md={3}><Card title="Active Subscriptions" value="0" /></Grid>
        <Grid item xs={12} sm={6} md={3}><Card title="AI Requests (Month)" value="0" /></Grid>
        <Grid item xs={12} sm={6} md={3}><Card title="Revenue (Plans)" value="LKR 0.00" /></Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2.2, borderRadius: 3, height: 260 }}>
            <Typography fontWeight={900}>System-wide Stats</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Next: connect admin endpoints for businesses, plans, AI logs
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
