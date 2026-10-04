import { tokenStore } from './tokenStore.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const MOCK_API_URL = import.meta.env.VITE_MOCK_API_URL || 'http://localhost:3100';

// Rutas que ya tienen backend real (van al gateway). Todo lo demás sigue en el mock.
// Cuando un servicio nuevo esté listo, se agrega su prefijo aquí (ej. '/vehicles' con fleet).
const REAL_BACKEND_PREFIXES = ['/auth', '/users'];

export function hasRealBackend(endpoint) {
    return REAL_BACKEND_PREFIXES.some((prefix) => endpoint === prefix || endpoint.startsWith(`${prefix}/`));
}

function baseUrlFor(endpoint) {
    return hasRealBackend(endpoint) ? API_URL : MOCK_API_URL;
}

// Error de la API con lo necesario para decidir qué mostrar:
// status (ej. 423, 429), code (el "error" del backend, ej. ACCOUNT_BLOCKED) y
// retryAfter (segundos del header Retry-After que pone el rate limit del gateway)
export class ApiError extends Error {
    constructor(res, body, endpoint) {
        super(body?.message || `Error ${res.status} en ${endpoint}`);
        this.name = 'ApiError';
        this.status = res.status;
        this.code = body?.error ?? null;
        const retryAfter = Number(res.headers.get('Retry-After'));
        this.retryAfter = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : null;
    }
}

let refreshPromise = null;
async function rawRequest(endpoint, { method = 'GET', body, headers = {} } = {}) {
    const token = tokenStore.getAccessToken();
    return fetch(`${baseUrlFor(endpoint)}${endpoint}`, {
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

    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) throw new Error('No se pudo refrescar la sesión');

    const data = await res.json();
    tokenStore.setAccessToken(data.accessToken);
    localStorage.setItem('rentamovil_refresh_token', data.refreshToken);
    return data.accessToken;
}

async function request(endpoint, options = {}) {
    let res = await rawRequest(endpoint, options);

    // Un 401 por contraseña actual incorrecta (cambiar email/contraseña) no es un token vencido
    const wrongPassword = res.status === 401
        && (await res.clone().json().catch(() => null))?.error === 'INCORRECT_PASSWORD';

    // Si expiro el access token, intenta refrescar UNA vez y reintenta la peticion original
    if (res.status === 401 && !wrongPassword && endpoint !== '/auth/login' && endpoint !== '/auth/refresh') {
        try {
            refreshPromise = refreshPromise || refreshAccessToken();
            await refreshPromise;
            refreshPromise = null;
            res = await rawRequest(endpoint, options);
        } catch {
            refreshPromise = null;
            tokenStore.clear();
            tokenStore.triggerRefreshFail(); // el authService decide qué hacer (ej. redirigir a /Login)
            throw new Error('Sesión expirada');
        }
    }

    if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new ApiError(res, errorBody, endpoint);
    }

    // 204 o 202 sin cuerpo (ej. /auth/password/forgot): no hay JSON que leer
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

export const httpClient = {
    get: (endpoint) => request(endpoint),
    post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
    put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
    patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body }),
    delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};