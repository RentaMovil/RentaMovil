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

// Mensajes pensados para leerse en pantalla: el status y el endpoint no significan nada
// para quien está usando la app.
const FRIENDLY_MESSAGES = {
    404: 'No encontramos lo que buscabas.',
    401: 'Tu sesión expiró. Vuelve a iniciar sesión.',
    403: 'No tienes permisos para ver esto.',
    409: 'No se pudo completar la operación por un conflicto con datos existentes.',
    429: 'Demasiados intentos. Espera un momento e inténtalo de nuevo.',
    503: 'El servicio no está disponible en este momento. Inténtalo más tarde.',
};

function friendlyError(status, endpoint, serverMessage) {
    // Si el backend manda un mensaje en español, tiene prioridad sobre el genérico.
    const message = serverMessage || FRIENDLY_MESSAGES[status]
        || 'No se pudo completar la operación. Inténtalo de nuevo.';
    const error = new Error(message);
    // Se conserva lo técnico para la consola, pero no se muestra en pantalla.
    error.status = status;
    error.endpoint = endpoint;
    if (!serverMessage) {
        console.warn(`[http] ${status} en ${endpoint}`);
    }
    return error;
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
            throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.');
        }
    }

    if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw friendlyError(res.status, endpoint, errorBody?.message);
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