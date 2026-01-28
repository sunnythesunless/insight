import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to include Token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const apiRPC = {
    // --- AUTH ---
    login: (data: any) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    refresh: (data: { refreshToken: string }) => api.post('/auth/refresh', data),
    forgotPassword: (data: { email: string }) => api.post('/auth/forgot-password', data),
    resetPassword: (token: string, data: { password: string }) => api.post(`/auth/reset-password/${token}`, data),
    verifyEmail: (token: string) => api.get(`/auth/verify-email/${token}`),

    // --- USER ---
    getMe: () => api.get('/users/me'),
    updateProfile: (data: any) => api.put('/users/me', data),

    // --- SYSTEM ---
    healthCheck: () => api.get('/health'), // Fixed: Health is usually at root or /api/health

    // --- DASHBOARD ---
    getDashboardStats: (workspaceId: string) => api.get(`/dashboard/stats?workspaceId=${workspaceId}`),

    // --- PULSE FEED ---
    getActivityFeed: (workspaceId: string) => api.get(`/activity/feed?workspaceId=${workspaceId}`),

    getMyWorkspaces: () => api.get('/workspaces'),
    joinWorkspace: (data: { inviteCode: string }) => api.post('/workspaces/join', data),
    createWorkspace: (data: { name: string }) => api.post('/workspaces', data),

    // --- INTELLIGENCE ---
    uploadDocument: (data: FormData) => api.post('/intelligence/ingest', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    queryKnowledge: (data: { query: string; workspaceId: string }) => api.post('/intelligence/query', data),

    // --- VAULT ---
    getDocuments: (workspaceId: string) => api.get(`/intelligence/documents?workspaceId=${workspaceId}`),
};

export default apiRPC;
