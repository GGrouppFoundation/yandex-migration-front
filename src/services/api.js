import { CONFIG } from '../config/constants.js';
import { authService } from './auth.js';

class ApiService {
    constructor() {
        this.requestCache = new Map();
        this.pendingRequests = new Map();
    }

    generateRequestKey(url, options = {}) {
        const method = options.method || 'GET';
        const body = options.body || '';
        return `${method}:${url}:${typeof body === 'string' ? body : ''}`;
    }

    async fetchWithAuth(url, options = {}) {
        const requestKey = this.generateRequestKey(url, options);

        if (this.pendingRequests.has(requestKey)) {
            return this.pendingRequests.get(requestKey);
        }

        const token = authService.getToken();
        if (!token) {
            authService.logout();
            throw new Error('No authentication token available');
        }

        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        };

        if (!headers['Content-Type'] && !(options.body instanceof FormData) && !(options.body instanceof File)) {
            headers['Content-Type'] = 'application/json';
        }

        const requestPromise = fetch(url, { ...options, headers })
            .finally(() => {
                this.pendingRequests.delete(requestKey);
            });

        this.pendingRequests.set(requestKey, requestPromise);
        return requestPromise;
    }

    async handleResponse(response, context = '') {
        if (response.status === 401) {
            authService.logout();
            throw new Error('Session expired. Please log in again.');
        }

        if (!response.ok) {
            let errorMessage = `Request failed (${response.status})`;

            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorData.message || errorMessage;
            } catch {
                errorMessage = `${context ? context + ': ' : ''}HTTP ${response.status} ${response.statusText}`;
            }

            throw new Error(errorMessage);
        }

        return response;
    }

    async getOrganizations() {
        try {
            const response = await this.fetchWithAuth(`${CONFIG.API_BASE_URL}/organizations`);
            await this.handleResponse(response, 'Failed to load organizations');
            return response.json();
        } catch (error) {
            throw new Error(`Organizations loading failed: ${error.message}`);
        }
    }

    async getQueues(orgId) {
        if (!orgId) {
            throw new Error('Organization ID is required');
        }

        try {
            const response = await this.fetchWithAuth(`${CONFIG.API_BASE_URL}/organizations/${orgId}/queues`);
            await this.handleResponse(response, 'Failed to load queues');
            return response.json();
        } catch (error) {
            throw new Error(`Queues loading failed: ${error.message}`);
        }
    }

    async exportConfig(orgId, queueIds) {
        if (!orgId || !queueIds || queueIds.length === 0) {
            throw new Error('Organization and queue selection required');
        }

        try {
            const response = await this.fetchWithAuth(
                `${CONFIG.API_BASE_URL}/organizations/${orgId}/configuration/export`,
                {
                    method: 'POST',
                    body: JSON.stringify({ queueIds })
                }
            );
            await this.handleResponse(response, 'Configuration export failed');
            return response;
        } catch (error) {
            throw new Error(`Export failed: ${error.message}`);
        }
    }

    async importConfig(orgId, file) {
        if (!orgId || !file) {
            throw new Error('Organization and file selection required');
        }

        try {
            const response = await this.fetchWithAuth(
                `${CONFIG.API_BASE_URL}/organizations/${orgId}/configuration/import`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/zip' },
                    body: file
                }
            );
            await this.handleResponse(response, 'Configuration import failed');
            return response.json();
        } catch (error) {
            throw new Error(`Import failed: ${error.message}`);
        }
    }

    clearCache() {
        this.requestCache.clear();
        this.pendingRequests.clear();
    }
}

export const apiService = new ApiService();