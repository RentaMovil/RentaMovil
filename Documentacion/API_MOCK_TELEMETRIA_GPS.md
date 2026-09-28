# API Mock — cambios del servicio de autenticación y telemetría GPS

Resumen de lo que se añadió a `web/Front-end/mock-server.cjs` y a `db.json`, para
que quien siga el trabajo sepa qué esperar y qué rutas existen.

**Resumen en una línea:** ninguna ruta existente se modificó ni se eliminó. Todo
son rutas y colecciones nuevas, más un comentario en una línea.

---

## 1. `mock-server.cjs`

El archivo pasó de 203 a 410 líneas. El diff es **+208 / −1**.

### 1.1 Rutas que ya existían: 9, sin tocar

```
POST  /auth/login
POST  /auth/register
POST  /auth/refresh
POST  /auth/logout
GET   /auth/me
POST  /auth/forgot-password
POST  /auth/verify-code
POST  /auth/reset-password
PATCH /auth/me/password
```

No se modificó ni una línea de sus handlers.

### 1.2 Rutas nuevas: 5

| Ruta | Qué hace | Protección |
|---|---|---|
| `PATCH /auth/me` | Guarda cambios del perfil del usuario autenticado | `requireAuth` |
| `GET /gps/vehicles` | Última posición conocida de cada vehículo con rental `IN_PROGRESS` | `requireAuth` |
| `GET /gps/vehicles/:vehicle_id` | Lo mismo, para un vehículo | `requireAuth` |
| `GET /gps/vehicles/:vehicle_id/track` | Historial de posiciones, para dibujar la ruta | `requireAuth` |
| `PATCH /notifications/:notification_id/read` | Marca una notificación como leída | **sin auth** (ver nota) |

> **Nota sobre la de notificaciones:** es la única sin `requireAuth`, a
> propósito. El cliente web la consume y su `httpClient` solo adjunta el
> `Bearer` cuando hay sesión en memoria. Si se le quiere poner auth, hay que
> revisar antes ese cliente.

### 1.3 Funciones auxiliares nuevas

Ninguna eliminada.

| Función | Para qué |
|---|---|
| `readCollection(name)` | Lee una colección del db como array plano |
| `byNewestFirst(a, b)` | Ordena posiciones de más reciente a más antigua |
| `listTrackedVehicles()` | Cruza `gps` + `vehicles` + `rentals` y arma la respuesta |

### 1.4 Dos detalles de implementación que conviene conocer

**Las rutas de GPS no las sirve json-server.** Están registradas antes de
`server.use(router)` porque tienen que cruzar tres colecciones. Si se movieran
después, json-server se las comería.

**Usan `Array.prototype`, no cadenas de lodash.** Dentro de una cadena de lodash,
`.reverse()` (alias de `_.reverseArray`) devuelve un array plano en vez de un
wrapper, así que encadenar `.find().value()` detrás rompe la consulta y el
resultado llega vacío. Con arrays de JS no hay ambigüedad.

### 1.5 La única línea borrada

Un comentario:

```diff
- server.use(router); // /vehicles, /maintenances siguen igual
+ server.use(router); // /vehicles, /maintenances, /notifications siguen igual
```

---

## 2. Pendiente: control de roles (INV-002)

**`requireRole` no existe en el archivo.** Solo está `requireAuth`, que verifica
que haya un JWT válido pero **no mira el rol**.

La regla de negocio pide que la ubicación solo la puedan leer `ADMIN` y
`SUPER_ADMIN`, y que un `CLIENT` reciba **403**. Eso **no está implementado**: hoy
un cliente con sesión sí puede llamar a los endpoints de GPS.

Para cerrarlo basta con añadir un middleware y encadenarlo en las tres rutas:

```js
function requireRole(...roles) {
    if (!roles.includes(req.auth.role)) {
        return res.status(403).json({ message: 'Sin permisos' });
    }
    next();
}

server.get('/gps/vehicles', requireAuth, requireRole('ADMIN', 'SUPER_ADMIN'), (req, res) => { ... });
```

Está anotado como `PENDIENTE` en el propio archivo.

> Nota: el rol viaja dentro del JWT (`jwt.sign({ sub, role })`), así que
> `req.auth.role` está disponible sin tocar la base de datos.

---

## 3. `db.json`

Se añadieron **tres colecciones**. `vehicles`, `maintenances`, `users` y
`notifications` no se tocaron.

### 3.1 `gpsDevices` — 1 registro

| Campo | Valor | Por qué |
|---|---|---|
| `id` | `gps-geotab-r809` | Identificador del dispositivo |
| `model` | `Geotab R-809` | Hardware asignado al vehículo |
| `provider` | `Geotab` | Plataforma de telemetría |
| `serial` | `null` | Sin número de serie todavía |
| `sim` | `null` | Sin SIM activada |
| `status` | `PENDING_CONNECTION` | **El dispositivo existe pero la conexión no está hecha** |
| `connected` | `false` | Idem |
| `last_seen_at` | `null` | Nunca ha reportado |
| `assigned_vehicle_id` | `lGpIl2fJQAk` | Vehículo asignado |

**Este es el punto importante:** el dispositivo está aprovisionado, pero la
conexión con la plataforma todavía no existe. Por eso `connected: false` y
`last_seen_at: null`. Los datos de posición que hay abajo **no vienen de un feed
en vivo**: son un recorrido histórico sembrado a mano.

### 3.2 `rentals` — 5 registros

| id | status | cliente | gps_id |
|---|---|---|---|
| 101 | `COMPLETED` | juan hernandez | `gps-geotab-r809` |
| 102 | `CANCELLED` | juan hernandez | `null` |
| 103 | `COMPLETED` | Nicole Dayana Ramirez Vargas | `gps-geotab-r809` |
| **105** | **`IN_PROGRESS`** | juan hernandez | `gps-geotab-r809` |
| 108 | `CONFIRMED` | juan hernandez | `null` |

**Los ids no son inventados.** 101, 102, 105 y 108 son los mismos a los que ya
apuntaban las notificaciones de `db.json`, así que esas referencias ahora
resuelven a algo real en vez de quedar colgadas.

La **105** es la única `IN_PROGRESS`: es la que muestra el módulo de ubicación del
admin.

### 3.3 `gps` — 8 registros de posición

Todos de la rental 105, con este recorrido:

| id | hora (UTC) | latitud | longitud | km/h | rumbo |
|---|---|---|---|---|---|
| 1 | 14:05 | 4.60970 | -74.08170 | 0 | — |
| 2 | 14:11 | 4.61830 | -74.08500 | 24 | 4° |
| 3 | 14:17 | 4.62700 | -74.08850 | 38 | 8° |
| 4 | 14:23 | 4.63560 | -74.09210 | 41 | 12° |
| 5 | 14:29 | 4.64410 | -74.09560 | 22 | 14° |
| 6 | 14:35 | 4.65250 | -74.09920 | 0 | — |
| 7 | 14:41 | 4.65660 | -74.11100 | 18 | 280° |
| 8 | 14:47 | 4.66020 | -74.10540 | 27 | 68° |

Fecha `2026-09-28`. Sale de Bogotá Centro y sube hacia Salitre; los dos extremos
son las coordenadas reales de las sucursales que ya están en
`src/shared/mocks/branches.js`, para que el mapa no caiga en el mar.

**Son datos sembrados, no una señal real.** Cuando exista la conexión con el
dispositivo, esta colección pasa a poblarse con lo que reporte el tracker.

---

## 4. Comprobado por HTTP

```
POST /auth/login                     -> 200  role=ADMIN
GET  /gps/vehicles                   -> 200  1 vehículo
  Chevrolet sendero (DEQ123) · rental #105 IN_PROGRESS
  cliente=juan hernandez · 4.66020, -74.10540 · 27 km/h · 68°
GET  /gps/vehicles/lGpIl2fJQAk       -> 200
GET  /gps/vehicles/lGpIl2fJQAk/track -> 200  8 puntos
GET  /gps/vehicles                   -> 401  sin token
GET  /gps/vehicles/no-existe         -> 404
```

---

## 5. Estado del frontend

| Pieza | Dónde | Estado |
|---|---|---|
| Servicio | `features/admin/vehicleLocation/services/locationService.js` | listo |
| Hook | `features/admin/vehicleLocation/hooks/useVehicleLocations.js` | listo |
| Mapa (Leaflet) | `features/admin/vehicleLocation/components/VehicleMap.jsx` | listo |
| Pantalla | `features/admin/vehicleLocation/pages/VehicleLocation.jsx` | lista |
| Ruta | `/VehicleLocation` con `RequireRole(["ADMIN","SUPER_ADMIN"])` | lista |
| Menú | Panel admin → Ubicación → "Ubicación de la flota" | visible |

El guard de rol **del frontend** sí está: un `CLIENT` que abra `/VehicleLocation`
lo redirige a `/home` y la pantalla no se monta. Lo que falta es el 403 en el
backend (sección 2).

---

## 6. Inconsistencia conocida

El vehículo `lGpIl2fJQAk` tiene `status: "En mantenimiento"` en `vehicles`, pero
la rental 105 está `IN_PROGRESS`. Se ve raro en la pantalla de ubicación: un carro
"en mantenimiento" que está alquilado.

No se tocó `vehicles` porque es dato semilla de otra persona. Si se quiere
alinearlo, lo más coherente con el dominio sería algo tipo `"Alquilado"` o
`"En uso"`.
