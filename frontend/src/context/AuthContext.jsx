import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    // Initialize from localStorage so page refresh doesn't lose session
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('almas_user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    // On mount: verify cookie is still valid with the backend
    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await api.get('/auth/profile');
                const freshUser = response.data.data;
                setUser(freshUser);
                localStorage.setItem('almas_user', JSON.stringify(freshUser));
            } catch {
                // Cookie expired or invalid — clear local state
                setUser(null);
                localStorage.removeItem('almas_user');
            } finally {
                setLoading(false);
            }
        };

        verifySession();

        // Listen for forced logout triggered by the axios 401 interceptor
        // (fires when refresh token is also expired — true session end)
        const handleForceLogout = () => {
            setUser(null);
            localStorage.removeItem('almas_user');
            localStorage.removeItem('savedAddress');
            localStorage.removeItem('cart');
        };
        window.addEventListener('auth:logout', handleForceLogout);
        return () => window.removeEventListener('auth:logout', handleForceLogout);
    }, []);

    const refreshProfile = async () => {
        try {
            const response = await api.get('/auth/profile');
            const freshUser = response.data.data;
            setUser(freshUser);
            localStorage.setItem('almas_user', JSON.stringify(freshUser));
            return freshUser;
        } catch (error) {
            console.error("Profile refresh failed:", error);
            return null;
        }
    };

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const loggedInUser = response.data.data.user;
        setUser(loggedInUser);
        localStorage.setItem('almas_user', JSON.stringify(loggedInUser));
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    };

    const googleLogin = async (token) => {
        const response = await api.post('/auth/google', { token });
        const loggedInUser = response.data.data.user;
        setUser(loggedInUser);
        localStorage.setItem('almas_user', JSON.stringify(loggedInUser));
        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout endpoint error (still logging out locally)", error);
        } finally {
            // Always clear local state regardless of backend response
            setUser(null);
            localStorage.removeItem('almas_user');
            localStorage.removeItem('savedAddress'); // Prevent address leak to next user session
            localStorage.removeItem('cart'); // Clear cart on logout
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, refreshProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
