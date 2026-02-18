import api from "./http";

export const getSubscriptionPlansApi = () => api.get("/api/v1/subscription-plans");
export const getSubscriptionPlanApi = (id) => api.get(`/api/v1/subscription-plans/${id}`);
export const createSubscriptionPlanApi = (data) => api.post("/api/v1/subscription-plans", data);
export const updateSubscriptionPlanApi = (id, data) => api.put(`/api/v1/subscription-plans/${id}`, data);
export const deleteSubscriptionPlanApi = (id) => api.delete(`/api/v1/subscription-plans/${id}`);

// Business subscription endpoints
export const getBusinessSubscriptionApi = () => api.get("/api/v1/business-subscriptions/current");
export const subscribeBusinessApi = (planId) => api.post("/api/v1/business-subscriptions", { planId });
export const cancelSubscriptionApi = () => api.post("/api/v1/business-subscriptions/cancel");
export const getSubscriptionHistoryApi = () => api.get("/api/v1/business-subscriptions/history");
