import api from "./http";

export const getBusinessesApi = () => api.get("/api/v1/admin/businesses");
export const getBusinessApi = (id) => api.get(`/api/v1/admin/businesses/${id}`);
