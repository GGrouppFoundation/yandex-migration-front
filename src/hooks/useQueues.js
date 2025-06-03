import { useState, useEffect } from 'react';
import { apiService } from '../services/api.js';

export const useQueues = (orgId) => {
    const [queues, setQueues] = useState([]);
    const [selectedQueues, setSelectedQueues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadQueues = async (orgId) => {
        if (!orgId) {
            setQueues([]);
            setSelectedQueues([]);
            return;
        }

        setLoading(true);
        setError(null);
        setSelectedQueues([]);

        try {
            const queueData = await apiService.getQueues(orgId);
            setQueues(queueData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQueues(orgId);
    }, [orgId]);

    const toggleQueueSelection = (queueId) => {
        setSelectedQueues(prev =>
            prev.includes(queueId)
                ? prev.filter(id => id !== queueId)
                : [...prev, queueId]
        );
    };

    const selectAllQueues = () => {
        setSelectedQueues(queues.length === selectedQueues.length ? [] : queues.map(q => q.id));
    };

    return {
        queues,
        selectedQueues,
        loading,
        error,
        toggleQueueSelection,
        selectAllQueues,
        reload: () => loadQueues(orgId)
    };
};