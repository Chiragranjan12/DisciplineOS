import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// ── Request interceptor: attach JWT ──────────────────────────────────
apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("discipline_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 (single redirect, no loop) ──────
let isRedirecting = false;

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
            if (!isRedirecting && window.location.pathname !== "/login") {
                isRedirecting = true;
                localStorage.removeItem("discipline_token");
                // Clear the cookie so middleware also sees the logout
                document.cookie = "discipline_token=; path=/; max-age=0";
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

// ── Service methods ──────────────────────────────────────────────────

export const taskService = {
    list: (date?: string) => apiClient.get(`/tasks${date ? `?date=${date}` : ""}`),
    create: (data: any) => apiClient.post("/tasks", data),
    toggle: (id: string) => apiClient.patch(`/tasks/${id}/toggle`),
};

export const habitService = {
    list: () => apiClient.get("/habits"),
    create: (data: any) => apiClient.post("/habits", data),
    toggle: (id: string) => apiClient.patch(`/habits/${id}/toggle`),
};

export const dailyLogService = {
    get: (date: string) => apiClient.get(`/daily-logs/${date}`),
    saveReflection: (date: string, data: any) => apiClient.post(`/daily-logs/${date}/reflection`, data),
};

export const analyticsService = {
    getSummary: () => apiClient.get("/analytics/summary"),
    getWeeklyScores: () => apiClient.get("/analytics/weekly-scores"),
    getRollingScores: () => apiClient.get("/analytics/rolling-scores"),
    getRadarData: () => apiClient.get("/analytics/radar-data"),
    getFailureReasons: () => apiClient.get("/analytics/failure-reasons"),
};

export const identityService = {
    get: () => apiClient.get("/identity"),
    update: (data: unknown) => apiClient.patch("/identity", data),
};
