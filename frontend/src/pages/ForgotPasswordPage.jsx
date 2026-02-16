import { useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { forgotPasswordApi } from "../api/authApi";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!email.trim()) return setError("Email is required");
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) return setError("Enter a valid email");

    try {
      setLoading(true);
      const res = await forgotPasswordApi({ email: email.trim() });
      setMsg(res.data?.message || "OTP sent (if this email exists).");
      // Go verify screen, carry email
      setTimeout(() => navigate("/verify-otp", { state: { email: email.trim() } }), 400);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Forgot password" subtitle="We will send a 6-digit OTP to your email.">
      <Box
        component={motion.form}
        onSubmit={onSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{ display: "grid", gap: 2 }}
      >
        {error ? <Alert severity="error">{error}</Alert> : null}
        {msg ? <Alert severity="success">{msg}</Alert> : null}

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
          sx={fieldSx}
        />

        <Button
          type="submit"
          disabled={loading}
          component={motion.button}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          sx={btnSx}
        >
          {loading ? "Sending..." : "Send OTP"}
        </Button>

        <Typography
          sx={{ color: "rgba(255,255,255,0.65)", fontSize: 13, cursor: "pointer", textAlign: "center" }}
          onClick={() => navigate("/login")}
        >
          Back to login
        </Typography>
      </Box>
    </AuthShell>
  );
}

const fieldSx = {
  "& .MuiInputBase-root": {
    color: "white",
    background: "rgba(255,255,255,0.06)",
    borderRadius: 2,
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.18)" },
};

const btnSx = {
  mt: 1,
  py: 1.2,
  borderRadius: 2.2,
  textTransform: "none",
  fontWeight: 800,
  fontSize: 16,
  color: "#0b1020",
  background: "linear-gradient(90deg, rgba(99,102,241,1), rgba(236,72,153,1))",
};
