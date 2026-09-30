# Estado de la app y conexión con el backend

> Documento generado tras la fase de migración al dominio del backend.
> Todo lo que sigue está verificado con `npm run typecheck` (0 errores) y
> `npx expo-doctor` (18/18 checks).

---

## 1. Resumen

RentaMovil es una app **Expo / React Native** que debe ser un cliente del
**mismo dominio** que consume el frontend web. No es una app paralela: es
el mismo negocio, con otra forma de presentarlo.

### Stack

| | |
|---|---|
| Framework | Expo SDK 54 (`expo@~54.0.33`) |
| Runtime | React Native 0.81.5 / React 19.1, New Architecture |
| Navegación | Expo Router 6 con `typedRoutes` |
| Lenguaje | TypeScript 5.9, `strict: true` |
| Estado | Context API |
| Datos | `fetch` nativo + json-server (web) |
| Persistencia | `expo-secure-store` con fallback a `AsyncStorage` |
| i18n | i18next, 4 idiomas (es/en/fr/pt) |
| Target actual | **Web** (`expo start --web`) |

### Verificación

```bash
npm run typecheck      # 0 errores
npx expo-doctor        # 18/18 checks
```

---

## 2. Dónde están las fuentes de verdad

El proyecto web está en un repositorio aparte. Es la referencia del dominio:

```
C:\Users\Niki\Documents\rentcar\RentaMovil\web\Front-end\
├── db.json                  <- datos de json-server (vehicles, users, sessions…)
├── mock-server.cjs          <- API con JWT real en el puerto 3001
└── src\types\*.ts           <- modelo de dominio formal con invariantes INV-xxx
```

Y esta app:

```
rentaMovil\src\
├── types\        <- ESPEJO de web/Front-end/src/types/
├── shared\api\   <- cliente HTTP y gestión de tokens
├── config\       <- URL de la API por plataforma
└── features\     <- auth, vehicles, branches, insurance, payment, reservation
```

### Tabla de origins

| Entidad | ¿En la API? | Origen del tipo |
|---|---|---|
| `Vehicle` | ✅ `GET /vehicles` | `db.json` |
| `User` / `Session` | ✅ `GET /auth/me` | `db.json` |
| `Maintenance` | ✅ json-server | `db.json` (gestión de flota, no la usa el cliente) |
| `InsuranceType` | ❌ | mock del web |
| `Branch` | ❌ | mock del web |
| `BankAccount` | ❌ | mock del web |
| `Reservation` | ❌ | mock del web, normalizado |
| `Payment` | ❌ | dominio del web |
| `Notification` | ❌ | mock del web |

**Regla de la API mock:** donde existe, se consume por HTTP. Donde no, se
resuelve con un mock local en `mocks/` y el shape del frontend web.

---

## 3. Cómo levantar el entorno

### 3.1 La API mock (en el proyecto web)

```bash
cd "C:\Users\Niki\Documents\rentcar\RentaMovil\web\Front-end"
npm run mock-api
```

Levanta json-server en `http://localhost:3001` con JWT. Verifica:

```bash
curl http://localhost:3001/vehicles
```

> **Ojo:** `db.json` tiene un bloque `"scripts"` que apunta a
> `mock-server.js`, un archivo que no existe. El script válido está en
> `package.json` y **sí funciona**. Es un leftover de json-server.

### 3.2 La app

```bash
cd "C:\Users\Niki\Documents\app_mobile\rentaMovil"
npx expo start -c --web
```

El `-c` limpia la caché. Necesario si acabas de tocar `app.json` (plugins).

### 3.3 La URL de la API

`src/config/env.ts` resuelve la URL base por plataforma:

| Entorno | URL por defecto |
|---|---|
| Web / iOS simulator | `http://localhost:3001` |
| Android emulador | `http://10.0.2.2:3001` |
| Dispositivo físico | **IP LAN de tu PC** |

Para fijo, crea `.env` (copia de `.env.example`):

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:3001
```

En dispositivo físico además el mock server debe escuchar en `0.0.0.0`
(ya lo hace: `server.listen(3001)` sin host) y el firewall de Windows tiene
que permitir el puerto 3001 en red privada.

### 3.4 Credenciales

`db.json` tiene usuarios con hash bcrypt real:

| Email | Contraseña |
|---|---|
| `nicolerv18007@gmail.com` | la que tengas registrada |
| `elcapitojuan@gmail.com` | la que tengas registrada |

El login responde `401 "Credenciales inválidas"` si no cuadra, y `403` si
`status !== "ACTIVE"`.

---

## 4. Arquitectura de capas

```
src/app/            rutas de Expo Router. SIN lógica de negocio.
src/features/<f>/
  ├── pages/        pantallas
  ├── components/   UI de la feature
  ├── services/     ÚNICO punto que conoce la fuente de datos
  ├── mocks/        datos falsos (solo si la API no cubre la entidad)
  ├── context/      estado compartido de la feature
  ├── types/        (ya no existe: todo vive en src/types)
  └── utils/        funciones puras
src/shared/         componentes y hooks reutilizables
src/types/          modelo de dominio, espejo del web
```

**Regla que se sostiene:** ningún componente ni página importa de `mocks/`.
Solo los `services/`. Cuando exista el backend, se cambia el cuerpo del
servicio y nada más.

### Contrato de la capa de datos

```ts
// src/shared/api/httpClient.ts
httpClient.get<T>(endpoint, options?)
httpClient.post<T>(endpoint, body?, options?)
httpClient.put<T>(endpoint, body?, options?)
httpClient.patch<T>(endpoint, body?, options?)
httpClient.delete<T>(endpoint, options?)
```

- `Authorization: Bearer <accessToken>` automático
- **401 → refresh una vez y reintenta** la petición original
- `204` → `null`
- El error propaga `errorBody.message` del server, que es el que se
  muestra al usuario
- `ApiError` con `status` y `body` para cuando necesites distinguir

### Tokens

| | Dónde | Por qué |
|---|---|---|
| Access token | Memoria | Vive 15 min, no debe sobrevivir al cierre de la app |
| Refresh token | `expo-secure-store` → fallback `AsyncStorage` | 7 días, credencial de larga duración |

En **web** `expo-secure-store` no funciona: su implementación web es
`export default {}` (Keychain/Keystore no existen en navegador). Por eso
hay fallback a `AsyncStorage` (localStorage). **En web el refresh token
queda en almacenamiento plano**, accesible a cualquier XSS. Para
producción web la respuesta sería una cookie `httpOnly`, que ya no
controla el móvil. Es una decisión consciente para la demo.

---

## 5. El flujo de negocio

### 5.1 Ciclo de la reserva

El dominio (`web/Front-end/src/types/reservation.ts`) define:

```
ReservationStatus =
  PENDING_PAYMENT | PENDING_REVIEW | CONFIRMED | CANCELLED | COMPLETED
```

`PENDING_PAYMENT` implica que **la reserva nace antes del pago**. Son dos
agregados separados:

```
┌─────────────┐   crear    ┌──────────────────┐   transfiere   ┌───────────────┐
│  /reservation│ ─────────► │ PENDING_PAYMENT  │ ─────────────► │ PENDING_REVIEW│
└─────────────┘            └──────────────────┘                └───────────────┘
                                                                       │
                                                        Admin aprueba  ▼
                                                            ┌────────────────┐
                                                            │   CONFIRMED    │
                                                            └────────────────┘
```

La pantalla de reserva **no espera método de pago**. La de pago **no crea
la reserva**.

### 5.2 El pago es transferencia manual (INV-004)

No hay pasarela. No existen tarjetas, ni CVV, ni `transactionId` de
gateway. El flujo es:

1. El cliente elige una **cuenta bancaria de la empresa** (solo activas)
2. Transfiere por su cuenta
3. **Sube el comprobante** (foto)
4. Queda en `PENDING_REVIEW`
5. Un Admin aprueba → `APPROVED` o rechaza → `REJECTED` + `rejectionReason`

El cliente nunca aprueba su propio pago.

### 5.3 Rutas

| Ruta | Pantalla |
|---|---|
| `/` | Home (búsqueda de vehículos) |
| `/menu` | Menú |
| `/reservations` | Historial de reservas |
| `/reservation` | Flujo de reserva activa |
| `/reservation-detail` | Detalle + cancelación |
| `/payment` | Pago |
| `/account` | Cuenta |
| `/account/change-password` | Cambio de contraseña |
| `/auth/login` | Login |
| `/payment` | (registro de pago) |

---

## 6. Conectar el backend real

### 6.1 Lo que ya está listo

Cada `service/` tiene el punto de migración marcado:

```ts
// src/features/insurance/services/insuranceService.ts
export async function getInsuranceOptions(): Promise<InsuranceType[]> {
  // Futuro:
  // return supabase
  //   .from("insurance_types")
  //   .select("*");

  return insurance;
}
```

### 6.2 Orden sugerido de conexión

#### Paso 1 · Auth (ya está contra la API real)

Los 9 endpoints de `mock-server.cjs` ya funcionan:

| Método | Ruta |
|---|---|
| POST | `/auth/login` |
| POST | `/auth/register` |
| POST | `/auth/refresh` |
| POST | `/auth/logout` |
| GET | `/auth/me` |
| POST | `/auth/forgot-password` |
| POST | `/auth/verify-code` |
| POST | `/auth/reset-password` |
| PATCH | `/auth/me/password` |

**Al conectar el backend real:** cambiar `ACCESS_TOKEN_SECRET` de
`'dev-access-secret'` a una variable de entorno, y subir el TTL del
refresh token.

#### Paso 2 · Vehículos (ya está contra la API real)

`vehicleService` ya consume `GET /vehicles`. Cuando el backend exponga
`branchId` y disponibilidad por fechas, añade esos filtros en
`applyFilters` (ya está la función, solo faltan los criterios) y quita el
comentario en `HomePage.runSearch` que explica por qué hoy no filtran.

#### Paso 3 · Reservas (no existe endpoint)

Hace falta en el backend:

```
GET    /reservations?clientId=...   historial del cliente
GET    /reservations/:id
POST   /reservations
PATCH  /reservations/:id/return-branch
PATCH  /reservations/:id/cancel
```

El web ya define el contrato de actualización de sucursal en
`booking/services/reservationServices.js`:

```js
// PATCH /api/reservations/:id/return-branch
// body: { returnBranchId }
```

Y la regla de negocio asociada (INV-013): *"Can only be changed up to 3
days before endDate"*. **Esa validación debe estar en el servidor**, no
solo en el cliente.

Al conectarlo, en `reservationService.ts` cambia los `console.log` por
lladas reales y `reservationsMock` por el fetch. El shape ya está
alineado: `Reservation` va normalizada con FKs.

#### Paso 4 · Pagos (no existe endpoint)

Hace falta:

```
GET  /bank-accounts?isActive=true    catálogo de cuentas
POST /payments                        multipart/form-data
```

`POST /payments` recibe `{ reservationId, bankAccountId, amount,
referenceNumber, receiptFile }` y devuelve `Payment` con `receiptFileUrl`
resuelto y `status: "PENDING_REVIEW"`.

**El comprobante necesita subida de archivo.** Hoy `ReceiptPicker` deja
una URI local:

| Plataforma | Qué es la URI | Problema |
|---|---|---|
| Nativo | `file://...` | Necesita `multipart/form-data` |
| **Web** | `blob:...` | **Es efímera**: se revoca al recargar. No se puede persistir ni enviar tal cual |

Al conectar, el flujo correcto es subir primero el archivo al storage y
guardar la URL devuelta, no la URI local.

#### Paso 5 · Catálogos locales

`insuranceService`, `branchService` y `getActiveBankAccounts` son mocks
locales. Cada uno tiene su `// Futuro:`. Endpoints sugeridos:

```
GET /insurance-types
GET /branches
GET /bank-accounts
```

---

### 6.3 Detalles que conviene no olvidar

- **CORS.** El backend real debe permitir el origen de la app. En web
  necesitarás `Access-Control-Allow-Origin` y permitir `Authorization` y
  `Content-Type` en `Access-Control-Allow-Headers`.
- **`money`.** El dominio define `Money = { amount, currency }`, pero
  `db.json` entrega `price: 100000` como número plano. La app trata el
  precio como número con `CURRENCY = "COP"`. Si el backend pasa a
  `Money`, adapta el mapper, no toda la app.
- **`status` de vehículo.** `db.json` lo da como texto libre en español
  (`"En mantenimiento"`), pero el dominio define
  `AVAILABLE | RENTED | MAINTENANCE`. La app lo tipa como `string` a
  propósito, para no romper cuando aparezca un valor nuevo. Si el backend
  se alinea con el dominio, puedes cerrarlo a unión.
- **`users` es snake_case, `vehicles` es camelCase.** La app replica los
  nombres tal cual llegan. No los "normalices" por tu cuenta o rompes la
  trazabilidad con la API.
- **`password_hash` nunca se recibe.** `mock-server.cjs` lo elimina con
  `toPublicUser()` antes de responder. El backend real debe hacer lo mismo.

---

## 7. Problemas conocidos

| # | Qué | Impacto | Nota |
|---|---|---|---|
| 1 | Reservas y pagos no persisten | Alto | `createReservation` devuelve un id hardcodeado y no guarda nada. Al recargar `/payment` dice "No hay una reserva activa" |
| 2 | El comprobante es efímero en web | Medio | `blob:` URL, se revoca al recargar |
| 3 | Filtrar vehículos por sucursal o fechas no funciona | Medio | `Vehicle` trae `location` como texto y no hay disponibilidad por rango. Requiere `branchId` en el backend |
| 4 | Editar perfil no persiste | Bajo | No existe `PATCH /users/:id`, solo `/auth/me/password`. El "guardar" resincroniza contra `/auth/me` |
| 5 | `302` claves de i18n sin usar | Bajo | De 318 definidas en `es.json`. Muchas quedaron de pantallas anteriores |
| 6 | Sin tests | Bajo | No hay runner configurado |

---

## 8. Reglas para no volver a romper esto

1. **`npm run typecheck` antes de commitear.** Antes no compilaba
   realmente: el `include` del tsconfig usaba `**/*.{ts,tsx,d.ts}`, patrón
   que TypeScript no expande, y solo procesaba 2 archivos. Había 28 errores
   ocultos. Si añades archivos, confirma que el contador sube.

2. **Nunca edites texto con PowerShell.** `Get-Content -Raw` decodifica
   como ANSI/CP1252 sin BOM, y al escribir en UTF-8 duplica la
   codificación: cada tilde se vuelve `Ã³` y cada emoji se destroza. Usa
   el editor, o Node con `fs.readFileSync(f, "utf8")`.

3. **NoAccedas a los mocks desde componentes.** Solo desde `services/`.
   Es lo que hace que migrar sea cambiar un cuerpo de función.

4. **Los tipos de dominio no se duplican.** Todo vive en `src/types/`, que
   es espejo de `web/Front-end/src/types/`. Si agregas un tipo, va ahí y se
   exporta en el barrel.

5. **`status` como `string` a menos que el dominio lo cierre.** La API da
   texto libre; una unión rígida rompe en cuanto aparezca un valor nuevo.

6. **Verifica con grep, no confíes en el exit code de un script.** Varios
   reemplazos "correctos" no aplicaron por culpa del whitespace o de los
   fines de línea CRLF, y el script igual reportaba éxito.
