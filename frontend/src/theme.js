import { createTheme, alpha } from "@mui/material/styles";

export const theme = createTheme({
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),
    h4: { fontWeight: 900, letterSpacing: -0.5 },
    h6: { fontWeight: 800, letterSpacing: -0.2 },
    subtitle1: { fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: `1px solid ${alpha("#000", 0.06)}`,
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 14, textTransform: "none", fontWeight: 800 },
      },
    },
  },
  palette: {
    mode: "light",
    background: {
      default: "#F6F8FC",
      paper: "#FFFFFF",
    },
    primary: {
      main: "#2563EB",
    },
    success: { main: "#16A34A" },
    warning: { main: "#F59E0B" },
    error: { main: "#EF4444" },
  },
});
