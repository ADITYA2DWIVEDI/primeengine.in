import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout()
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api

// API functions
export const authAPI = {
    login: (email: string, password: string) =>
        api.post('/api/auth/login', { email, password }),
    signup: (email: string, password: string, name: string) =>
        api.post('/api/auth/signup', { email, password, name }),
    googleAuth: (idToken: string) =>
        api.post('/api/auth/google', { idToken }),
}

export const projectsAPI = {
    getAll: () => api.get('/api/projects'),
    getById: (id: string) => api.get(`/api/projects/${id}`),
    create: (data: { name: string; description?: string }) =>
        api.post('/api/projects', data),
    update: (id: string, data: any) => api.put(`/api/projects/${id}`, data),
    delete: (id: string) => api.delete(`/api/projects/${id}`),
    generate: (prompt: string, projectId?: string) =>
        api.post('/api/generate', { prompt, projectId }),
    deploy: (id: string) => api.post(`/api/projects/${id}/deploy`),
    export: (id: string) => api.post(`/api/projects/${id}/export`),
}

export const templatesAPI = {
    getAll: () => api.get('/api/templates'),
    getFeatured: () => api.get('/api/templates/featured'),
    getById: (id: string) => api.get(`/api/templates/${id}`),
    use: (id: string) => api.post(`/api/templates/${id}/use`),
}
