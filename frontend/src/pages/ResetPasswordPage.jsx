import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { resetPasswordApi } from "../api/authApi";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [email, setEmail] = useState(state?.email || "");
  const [resetToken, setResetToken] = useState(state?.resetToken || "");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !resetToken) navigate("/forgot-password", { replace: true });
  }, [email, resetToken, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (newPassword.length < 8) return setError("Password must be at least 8 characters");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");

    try {
      setLoading(true);
      const res = await resetPasswordApi({
        email,
        resetToken,
        newPassword,
        confirmPassword,
      });
      setMsg(res.data?.message || "Password updated successfully");

      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Set new password" subtitle="Create a new password and login again.">
      <Box component={motion.form} onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} sx={{ display: "grid", gap: 2 }}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {msg ? <Alert severity="success">{msg}</Alert> : null}

        <TextField
          label="New password"
          type={show1 ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
          sx={fieldSx}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow1((s) => !s)} edge="end">
                  {show1 ? (
                    <VisibilityOff sx={{ color: "rgba(255,255,255,0.7)" }} />
                  ) : (
                    <Visibility sx={{ color: "rgba(255,255,255,0.7)" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm password"
          type={show2 ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
          sx={fieldSx}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow2((s) => !s)} edge="end">
                  {show2 ? (
                    <VisibilityOff sx={{ color: "rgba(255,255,255,0.7)" }} />
                  ) : (
                    <Visibility sx={{ color: "rgba(255,255,255,0.7)" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          disabled={loading}
          component={motion.button}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          sx={btnSx}
        >
          {loading ? "Updating..." : "Update password"}
        </Button>

        <Typography
          sx={{ color: "rgba(255,255,255,0.65)", fontSize: 13, textAlign: "center" }}
        >
          After updating, you will be redirected to login.
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
  background: "linear-gradient(90deg, rgba(236,72,153,1), rgba(99,102,241,1))",
};
