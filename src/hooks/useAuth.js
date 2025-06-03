import { useState, useEffect } from 'react';
import { authService } from '../services/auth.js';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getUser();
        if (currentUser && authService.isAuthenticated()) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = (userData) => setUser(userData);
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return { user, loading, login, logout, isAuthenticated: !!user };
};