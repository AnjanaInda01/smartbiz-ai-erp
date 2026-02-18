import api from "./http";

export const getCustomersApi = () => api.get("/api/v1/customers");
export const getCustomerApi = (id) => api.get(`/api/v1/customers/${id}`);
export const createCustomerApi = (data) => api.post("/api/v1/customers", data);
export const updateCustomerApi = (id, data) => api.put(`/api/v1/customers/${id}`, data);
export const deleteCustomerApi = (id) => api.delete(`/api/v1/customers/${id}`);
