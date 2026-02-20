import api from "./http";

export const getStaffApi = () => api.get("/api/v1/staff");
export const getStaffMemberApi = (id) => api.get(`/api/v1/staff/${id}`);
export const createStaffApi = (data) => api.post("/api/v1/staff", data);
export const updateStaffApi = (id, data) => api.put(`/api/v1/staff/${id}`, data);
export const deleteStaffApi = (id) => api.delete(`/api/v1/staff/${id}`);
