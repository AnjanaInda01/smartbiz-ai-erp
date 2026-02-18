import api from "./http";

export const getAiUsageApi = () => api.get("/api/v1/admin/dashboard/ai-usage");
export const getSystemStatisticsApi = () => api.get("/api/v1/admin/dashboard/statistics");
