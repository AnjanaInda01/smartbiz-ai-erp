import { Box, Container, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.35), transparent 50%)," +
          "radial-gradient(circle at 80% 30%, rgba(236,72,153,0.25), transparent 55%)," +
          "radial-gradient(circle at 50% 80%, rgba(34,197,94,0.18), transparent 55%)," +
          "linear-gradient(135deg, #0b1020 0%, #0a1226 45%, #070b16 100%)",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          }}
        >
          <Typography variant="h4" sx={{ color: "white", fontWeight: 800 }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 0.7 }}>
              {subtitle}
            </Typography>
          ) : null}

          <Box sx={{ mt: 3 }}>{children}</Box>
        </Paper>

        <Typography
          sx={{
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            mt: 2.5,
            fontSize: 12,
          }}
        >
          SmartBiz AI ERP • Secure Login
        </Typography>
      </Container>
    </Box>
  );
}
