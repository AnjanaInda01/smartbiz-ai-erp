import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../auth/AuthProvider";
import { roleHome } from "../auth/roleRedirect";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role) navigate(roleHome(user.role), { replace: true });
  }, [user, navigate]);

  const validate = () => {
    if (!email.trim()) return "Email is required";
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) return "Enter a valid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) return setError(v);

    try {
      setLoading(true);
      await login(email.trim(), password);
      // AuthProvider loads /auth/me, so user role is ready
      // Navigate after a short tick
      setTimeout(() => {
        const stored = JSON.parse(localStorage.getItem("me") || "null");
        if (stored?.role) navigate(roleHome(stored.role), { replace: true });
        else navigate("/", { replace: true });
      }, 50);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Login to SmartBiz to manage inventory, sales and AI insights."
    >
      <Box
        component={motion.form}
        onSubmit={onSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        sx={{ display: "grid", gap: 2 }}
      >
        {error ? <Alert severity="error">{error}</Alert> : null}

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          fullWidth
          InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
          sx={fieldSx}
        />

        <TextField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPw ? "text" : "password"}
          autoComplete="current-password"
          fullWidth
          InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
          sx={fieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: "rgba(255,255,255,0.55)" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPw((s) => !s)} edge="end">
                  {showPw ? (
                    <VisibilityOff sx={{ color: "rgba(255,255,255,0.7)" }} />
                  ) : (
                    <Visibility sx={{ color: "rgba(255,255,255,0.7)" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
          <Link
            onClick={() => navigate("/forgot-password")}
            sx={linkSx}
            underline="hover"
          >
            Forgot password?
          </Link>

          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
            Role-based dashboards
          </Typography>
        </Box>

        <Button
          type="submit"
          disabled={loading}
          component={motion.button}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
          sx={btnSx}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
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
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.18)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.28)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.45)",
  },
};

const btnSx = {
  mt: 1,
  py: 1.2,
  borderRadius: 2.2,
  textTransform: "none",
  fontWeight: 800,
  fontSize: 16,
  color: "#0b1020",
  background:
    "linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(236,72,153,1) 55%, rgba(34,197,94,1) 100%)",
};

const linkSx = {
  cursor: "pointer",
  color: "rgba(255,255,255,0.8)",
  fontSize: 13,
};
