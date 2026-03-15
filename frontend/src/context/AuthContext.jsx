import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                // If there's a profile route, check it. Let's assume /auth/profile exists
                const response = await api.get('/auth/profile');
                setUser(response.data.data); // Adjust based on your backend response format
            } catch (error) {
                console.log("No user logged in");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        setUser(response.data.data.user); // Assuming response.data.data.user
        return response.data;
    };

    const register = async (userData) => {
        // adjust fields as needed for backend
        const response = await api.post('/auth/register', userData);
        setUser(response.data.data.user); 
        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
