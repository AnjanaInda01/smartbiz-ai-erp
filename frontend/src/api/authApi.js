import api from "./http";

export const loginApi = (payload) => api.post("/api/v1/auth/login", payload);
export const meApi = () => api.get("/api/v1/auth/me");
