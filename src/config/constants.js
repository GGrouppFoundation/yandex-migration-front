export const CONFIG = {
    YANDEX_CLIENT_ID: process.env.REACT_APP_YANDEX_CLIENT_ID,
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
    REDIRECT_URI: window.location.origin,
    STORAGE_KEYS: {
        TOKEN: 'yandex_token',
        USER: 'yandex_user'
    },
    ENDPOINTS: {
        YANDEX_AUTH: 'https://oauth.yandex.ru/authorize',
        YANDEX_INFO: 'https://login.yandex.ru/info'
    }
};