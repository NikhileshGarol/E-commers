const apiBaseUrl = () => {
    return import.meta.env.VITE_BASE_API;
}

export const API_CONFIG = {
    BASE_URL: apiBaseUrl(),
    TIMEOUT: 10000,
};
