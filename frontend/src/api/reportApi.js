import api from "./http";

export const getDashboardReportApi = () => api.get("/api/v1/reports/dashboard");
