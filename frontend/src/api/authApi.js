import api from "./axios";

export const loginApi = (payload) => api.post("/api/v1/auth/login", payload);
export const meApi = () => api.get("/api/v1/auth/me");

export const forgotPasswordApi = (payload) =>
  api.post("/api/v1/auth/forgot-password", payload);

export const verifyOtpApi = (payload) =>
  api.post("/api/v1/auth/verify-otp", payload);

export const resetPasswordApi = (payload) =>
  api.post("/api/v1/auth/reset-password", payload);
