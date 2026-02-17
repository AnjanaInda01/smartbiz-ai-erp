import { Box, Grid, Paper, Typography } from "@mui/material";

export default function StaffDashboard() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
        Staff Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.2, borderRadius: 3 }}>
            <Typography fontWeight={900}>Quick Invoice</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
              Create invoices quickly and update stock automatically
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2.2, borderRadius: 3 }}>
            <Typography fontWeight={900}>Low Stock List</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
              See which items need restocking today
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
