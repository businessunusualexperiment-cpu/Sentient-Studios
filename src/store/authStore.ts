import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Connection } from '@shared/types';
interface User {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  isMentor?: boolean;
}
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  mentorships: Connection[]; // Single source of truth for all connections
  login: (user: User, connections: Connection[]) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  addMentorship: (connection: Connection) => void;
  updateMentorshipStatus: (connectionId: string, status: 'accepted' | 'declined') => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      mentorships: [],
      login: (user, connections) => set({ isAuthenticated: true, user, mentorships: connections }),
      logout: () => set({ isAuthenticated: false, user: null, mentorships: [] }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      addMentorship: (connection) =>
        set((state) => ({
          mentorships: [...state.mentorships.filter(m => m.id !== connection.id), connection],
        })),
      updateMentorshipStatus: (connectionId, status) =>
        set((state) => ({
          mentorships: state.mentorships.map((c) =>
            c.id === connectionId ? { ...c, status, acceptedAt: status === 'accepted' ? Date.now() : c.acceptedAt } : c
          ),
        })),
    }),
    {
      name: 'sentient-auth-storage', // Updated storage name for new branding
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : ({} as Storage))), // Defer localStorage access
    }
  )
);