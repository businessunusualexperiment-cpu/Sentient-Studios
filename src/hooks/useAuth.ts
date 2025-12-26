import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { Connection, User, ChatMessage } from '@shared/types';
import { api } from '@/lib/api-client';
import { useMemo } from 'react';
type AuthUser = Omit<User, 'passwordHash'>;
export const useAuth = () => {
    const navigate = useNavigate();
    const {
        isAuthenticated,
        user,
        mentorships,
        login: storeLogin,
        logout: storeLogout,
        updateUser: storeUpdateUser,
        addMentorship: storeAddMentorship,
    } = useAuthStore(
        useShallow((state) => ({
            isAuthenticated: state.isAuthenticated,
            user: state.user,
            mentorships: state.mentorships,
            login: state.login,
            logout: state.logout,
            updateUser: state.updateUser,
            addMentorship: state.addMentorship,
        }))
    );
    const fetchUserConnections = async (userId: string) => {
        if (!userId) return [];
        try {
            const connections = await api<Connection[]>(`/api/connections/mentee/${userId}`);
            return connections;
        } catch (error) {
            console.error("Failed to fetch user connections", error);
            return [];
        }
    };
    const login = async (email: string, password?: string) => {
        const loggedInUser = await api<AuthUser>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        const connections = await fetchUserConnections(loggedInUser.id);
        storeLogin(loggedInUser, connections);
        navigate('/profile');
    };
    const signup = async (email: string, password?: string, name?: string) => {
        const signedUpUser = await api<AuthUser>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
        storeLogin(signedUpUser, []); // New user has no connections
        navigate('/profile');
    };
    const logout = () => {
        storeLogout();
        navigate('/login');
    };
    const updateProfile = async (data: Partial<AuthUser>) => {
        if (!user) throw new Error("User not authenticated");
        const updatedUser = await api<AuthUser>(`/api/users/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        storeUpdateUser(updatedUser);
    };
    const requestConnection = async (mentorId: string, initialMessage?: string) => {
        if (!user) throw new Error("User not authenticated");
        const newConnection = await api<Connection>('/api/connections', {
            method: 'POST',
            body: JSON.stringify({ mentorId, menteeId: user.id, initialMessage }),
        });
        storeAddMentorship(newConnection);
    };
    const mentorRespondToConnectionRequest = async (connectionId: string, status: 'accepted' | 'declined') => {
        if (!user) throw new Error("User not authenticated");
        const updatedConnection = await api<Connection>(`/api/connections/${connectionId}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
        storeAddMentorship(updatedConnection);
    };
    const toggleMentorStatus = async (isMentor: boolean) => {
        if (!user) throw new Error("User not authenticated");
        const updatedUser = await api<AuthUser>(`/api/users/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify({ isMentor }),
        });
        storeUpdateUser(updatedUser);
    };
    const fetchChatMessages = async (chatId: string) => {
        try {
            const messages = await api<ChatMessage[]>(`/api/chats/${chatId}/messages`);
            return messages;
        } catch (error) {
            console.error("Failed to fetch chat messages", error);
            return [];
        }
    };
    const sendChatMessage = async (chatId: string, text: string) => {
        if (!user) throw new Error("User not authenticated");
        try {
            const message = await api<ChatMessage>(`/api/chats/${chatId}/messages`, {
                method: 'POST',
                body: JSON.stringify({ userId: user.id, text }),
            });
            return message;
        } catch (error) {
            console.error("Failed to send chat message", error);
            throw error;
        }
    };
    const pendingConnections = useMemo(() =>
        mentorships.filter(c => c.status === 'pending').map(c => c.mentorId),
        [mentorships]
    );
    const isCurrentUserMentor = useMemo(() => user?.isMentor === true, [user]);
    return {
        isAuthenticated,
        user,
        mentorships,
        pendingConnections,
        isCurrentUserMentor,
        login,
        signup,
        logout,
        updateProfile,
        requestConnection,
        mentorRespondToConnectionRequest,
        toggleMentorStatus,
        fetchChatMessages,
        sendChatMessage,
    };
};