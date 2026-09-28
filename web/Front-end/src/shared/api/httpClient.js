import { tokenStore } from './tokenStore.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
let refreshPromise = null;
async function rawRequest(endpoint, { method = 'GET', body, headers = {} } = {}) {
    const token = tokenStore.getAccessToken();
    return fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });
}

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('rentamovil_refresh_token');
    if (!refreshToken) throw new Error('No hay refresh token');

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) throw new Error('No se pudo refrescar la sesión');

    const data = await res.json();
    tokenStore.setAccessToken(data.accessToken);
    return data.accessToken;
}

async function request(endpoint, options = {}) {
    let res = await rawRequest(endpoint, options);

    // Si expiro el access token, intenta refrescar UNA vez y reintenta la peticion original
    if (res.status === 401 && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
        try {
            refreshPromise = refreshPromise || refreshAccessToken();
            await refreshPromise;
            refreshPromise = null;
            res = await rawRequest(endpoint, options);
        } catch (err) {
            refreshPromise = null;
            tokenStore.clear();
            tokenStore.triggerRefreshFail(); // el authService decide qué hacer (ej. redirigir a /Login)
            throw new Error('Sesión expirada');
        }
    }

    if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.message || `Error ${res.status} en ${endpoint}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

export const httpClient = {
    get: (endpoint) => request(endpoint),
    post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
    put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
    patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body }),
    delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};