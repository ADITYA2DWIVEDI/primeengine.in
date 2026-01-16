import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: string
    email: string
    name: string
    avatarUrl?: string
    role: string
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    setUser: (user: User | null, token?: string) => void
    logout: () => void
    setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,

            setUser: (user, token) => set({
                user,
                token: token || null,
                isAuthenticated: !!user,
                isLoading: false,
            }),

            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            }),

            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: 'prime-engine-auth',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
)
