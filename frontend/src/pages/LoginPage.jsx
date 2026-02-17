import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import AuthShell from "../components/AuthShell";
import { useAuth } from "../auth/AuthProvider";
import { roleHome } from "../auth/roleRedirect";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // If user tried to access protected page, we can redirect back after login.
  const from = useMemo(() => {
    const state = location.state;
    // Optional: if you used location.state.from in ProtectedRoute in future
    if (state && typeof state === "object" && state.from && state.from.pathname) {
      return state.from.pathname;
    }
    return null;
  }, [location.state]);

  // ✅ Redirect after auth state is ready (no navigation during render)
  useEffect(() => {
    if (user?.role) {
      // Prefer "from" if available, else role-based home
      navigate(from ?? roleHome(user.role), { replace: true });
    }
  }, [user, from, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login(cleanEmail, password);
      // ✅ Don't navigate here — useEffect will handle redirect when user is set
    } catch (err) {
      // Your login() may throw with axios error; this keeps it safe
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please check your credentials and try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          mx: "auto",
        }}
      >
        <Card elevation={8} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  SmartBiz ERP
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign in to continue
                </Typography>
              </Box>

              {error ? <Alert severity="error">{error}</Alert> : null}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    fullWidth
                  />

                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((v) => !v)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={submitting}
                    sx={{ py: 1.2, borderRadius: 2 }}
                  >
                    {submitting ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={18} />
                        <span>Signing in...</span>
                      </Stack>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Link component={RouterLink} to="/forgot-password" underline="hover">
                      Forgot password?
                    </Link>
                  </Stack>

                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Tip: Use the correct account role (Admin / Owner / Staff). You’ll be redirected
                    automatically after login.
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </AuthShell>
  );
}
