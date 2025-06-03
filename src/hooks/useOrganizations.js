import { useState, useEffect } from 'react';
import { apiService } from '../services/api.js';

export const useOrganizations = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadOrganizations = async () => {
        setLoading(true);
        setError(null);
        try {
            const orgs = await apiService.getOrganizations();
            setOrganizations(orgs);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrganizations();
    }, []);

    return { organizations, loading, error, reload: loadOrganizations };
};