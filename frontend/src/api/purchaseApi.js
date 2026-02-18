import api from "./http";

export const getPurchasesApi = () => api.get("/api/v1/purchases");
export const getPurchaseApi = (id) => api.get(`/api/v1/purchases/${id}`);
export const createPurchaseApi = (data) => api.post("/api/v1/purchases", data);
export const confirmPurchaseApi = (id) => api.post(`/api/v1/purchases/${id}/confirm`);
