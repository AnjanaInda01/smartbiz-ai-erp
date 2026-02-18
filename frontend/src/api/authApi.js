import api from "./http";

export const loginApi = (payload) => api.post("/api/v1/auth/login", payload);
export const meApi = () => api.get("/api/v1/auth/me");
export const forgotPasswordApi = (email) => api.post("/api/v1/auth/forgot-password", { email });
export const verifyOtpApi = (email, otp) => api.post("/api/v1/auth/verify-otp", { email, otp });
export const resetPasswordApi = (email, resetToken, newPassword, confirmPassword) => 
  api.post("/api/v1/auth/reset-password", { email, resetToken, newPassword, confirmPassword });