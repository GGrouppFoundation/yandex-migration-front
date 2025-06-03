import { CONFIG } from '../config/constants.js';
import { storage } from './storage.js';

class AuthService {
    constructor() {
        this.storage = storage;
    }

    getYandexAuthUrl() {
        const params = new URLSearchParams({
            response_type: 'token',
            client_id: CONFIG.YANDEX_CLIENT_ID,
            redirect_uri: CONFIG.REDIRECT_URI
        });
        return `${CONFIG.ENDPOINTS.YANDEX_AUTH}?${params.toString()}`;
    }

    async getUserInfo(token) {
        const response = await fetch(CONFIG.ENDPOINTS.YANDEX_INFO, {
            headers: { 'Authorization': `OAuth ${token}` }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ description: 'Failed to get user info' }));
            throw new Error(errorData.description || 'Failed to get user info');
        }

        return response.json();
    }

    async exchangeTokenForIAM(token) {
        const userInfo = await this.getUserInfo(token);
        const response = await fetch(`${CONFIG.API_BASE_URL}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ yandexPassportOauthToken: token })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                detail: `Failed to exchange OAuth token: HTTP ${response.status}`
            }));
            throw new Error(errorData.detail || `Failed to exchange OAuth token: HTTP ${response.status}`);
        }

        const tokenData = await response.json();
        const userData = { name: userInfo.login, id: userInfo.id };

        this.storage.set(CONFIG.STORAGE_KEYS.TOKEN, tokenData.iamToken);
        this.storage.set(CONFIG.STORAGE_KEYS.USER, userData);

        return userData;
    }

    getToken() {
        return this.storage.get(CONFIG.STORAGE_KEYS.TOKEN);
    }

    getUser() {
        return this.storage.get(CONFIG.STORAGE_KEYS.USER);
    }

    logout() {
        this.storage.remove(CONFIG.STORAGE_KEYS.TOKEN);
        this.storage.remove(CONFIG.STORAGE_KEYS.USER);
    }

    isAuthenticated() {
        return !!this.getToken();
    }
}

export const authService = new AuthService();