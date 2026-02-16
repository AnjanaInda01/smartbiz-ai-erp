import { useEffect, useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { verifyOtpApi } from "../api/authApi";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [email, setEmail] = useState(state?.email || "");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) navigate("/forgot-password", { replace: true });
  }, [email, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.match(/^\d{6}$/)) return setError("OTP must be 6 digits");

    try {
      setLoading(true);
      const res = await verifyOtpApi({ email, otp });
      const resetToken = res.data?.resetToken;
      if (!resetToken) throw new Error("No reset token returned");

      navigate("/reset-password", { state: { email, resetToken } });
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Verify OTP" subtitle="Enter the 6-digit code sent to your email.">
      <Box component={motion.form} onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ display: "grid", gap: 2 }}>
        {error ? <Alert severity="error">{error}</Alert> : null}

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
          sx={fieldSx}
        />

        <TextField
          label="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          fullWidth
          inputProps={{ inputMode: "numeric" }}
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
          {loading ? "Verifying..." : "Verify"}
        </Button>

        <Typography
          sx={{ color: "rgba(255,255,255,0.65)", fontSize: 13, cursor: "pointer", textAlign: "center" }}
          onClick={() => navigate("/forgot-password")}
        >
          Resend / Change email
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
  background: "linear-gradient(90deg, rgba(34,197,94,1), rgba(99,102,241,1))",
};
