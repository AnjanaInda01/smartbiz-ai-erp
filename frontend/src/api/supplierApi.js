import api from "./http";

export const getSuppliersApi = () => api.get("/api/v1/suppliers");
export const getSupplierApi = (id) => api.get(`/api/v1/suppliers/${id}`);
export const createSupplierApi = (data) => api.post("/api/v1/suppliers", data);
export const updateSupplierApi = (id, data) => api.put(`/api/v1/suppliers/${id}`, data);
export const deleteSupplierApi = (id) => api.delete(`/api/v1/suppliers/${id}`);
