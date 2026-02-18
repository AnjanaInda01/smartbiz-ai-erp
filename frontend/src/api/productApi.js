import api from "./http";

export const getProductsApi = () => api.get("/api/v1/products");
export const getProductApi = (id) => api.get(`/api/v1/products/${id}`);
export const createProductApi = (data) => api.post("/api/v1/products", data);
export const updateProductApi = (id, data) => api.put(`/api/v1/products/${id}`, data);
export const deleteProductApi = (id) => api.delete(`/api/v1/products/${id}`);
