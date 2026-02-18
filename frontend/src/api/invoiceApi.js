import api from "./http";

export const getInvoicesApi = () => api.get("/api/v1/invoices");
export const getInvoiceApi = (id) => api.get(`/api/v1/invoices/${id}`);
export const createInvoiceApi = (data) => api.post("/api/v1/invoices", data);
export const confirmInvoiceApi = (id) => api.post(`/api/v1/invoices/${id}/confirm`);
