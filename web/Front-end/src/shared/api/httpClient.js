import { tokenStore } from './tokenStore.js';

// /api y /mock son rutas del proxy de Vite (vite.config.js): el gateway (:8080) y el mock (:3100).
const API_URL = import.meta.env.VITE_API_URL || '/api';
const MOCK_API_URL = import.meta.env.VITE_MOCK_API_URL || '/mock';

// Lo que ya tiene servicio real va al gateway; el resto (pagos, cuentas bancarias, GPS) sigue en
// el mock hasta que su servicio exista. Al publicar uno nuevo se agrega aquí su prefijo.
const REAL_BACKEND_PREFIXES = [
    '/auth', '/users',
    '/reservations', '/rentals', '/notifications',
    '/vehicles', '/branches', '/maintenances',
    '/brands', '/categories', '/engine-types', '/vehicle-models', '/maintenance-types',
];

export function hasRealBackend(endpoint) {
    return REAL_BACKEND_PREFIXES.some((prefix) =>
        endpoint === prefix || endpoint.startsWith(`${prefix}/`) || endpoint.startsWith(`${prefix}?`));
}

const baseUrlFor = (endpoint) => (hasRealBackend(endpoint) ? API_URL : MOCK_API_URL);

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
    // iam rota el refresh token en cada uso: si no se guarda el nuevo, el siguiente refresh
    // manda el viejo, iam lo toma como robado y cierra todas las sesiones
    localStorage.setItem('rentamovil_refresh_token', data.refreshToken);
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

    // Un 401 por contraseña actual incorrecta (cambiar correo/contraseña) no es un token vencido
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
            throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.');
        }
    }

    if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw friendlyError(res.status, endpoint, errorBody?.message);
    }

    // 204, o 202 sin cuerpo (ej. /auth/password/forgot): no hay JSON que leer
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