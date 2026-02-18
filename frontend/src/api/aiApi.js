import api from "./http";

export const generateInsightApi = (question) => api.post("/api/v1/ai/insight", { question });
export const generateEmailApi = (prompt) => api.post("/api/v1/ai/email", { prompt });
export const generateSocialPostApi = (prompt) => api.post("/api/v1/ai/social-post", { prompt });
export const generateInvoiceSummaryApi = (invoiceId) => api.post(`/api/v1/ai/invoice/${invoiceId}/summary`);
