# 🩺 Diagnóstico del Frontend — RentaMovil

**Fecha:** 22-09-2026
**Alcance:** estado actual de `web/Front-end/src` visto en conjunto, y qué tan lejos está de poder conectarse a un backend real.
**Relación con otros documentos:** este diagnóstico complementa a [`GUIA_CONEXION_BACKEND.md`](./GUIA_CONEXION_BACKEND.md) (que ya explica el "cómo" — patrón `apiClient` + contrato sugerido por servicio). Acá el foco es distinto: una foto completa del estado actual — qué ya quedó bien encaminado, qué se resolvió en la última sesión de trabajo, y qué hallazgos nuevos (duplicación de datos, salud de código, credenciales hardcodeadas) hay que tener en cuenta antes de repartir el trabajo de conexión.

---

## 1. Resumen ejecutivo

El frontend **no necesita un rewrite** para conectarse a backend — el diseño de las partes más recientes (contextos de reserva/pago, tipos de dominio en `src/types/*.ts` con invariantes documentadas) es sólido y ya está pensado para eso. El trabajo pendiente es un refactor incremental, servicio por servicio, siguiendo el patrón que ya quedó diseñado en `GUIA_CONEXION_BACKEND.md`.

Hay 4 tipos de brecha, y no pesan igual:

1. **Autenticación no existe** — es el bloqueante más grande, porque varios de los otros servicios (reservas del usuario, panel admin) van a necesitar saber "quién está logueado".
2. **La infraestructura de conexión está diseñada pero no implementada** — no hay `.env`, no hay `apiClient`, no hay `VITE_API_URL` definida en ningún lado todavía.
3. **El mismo dato tiene formas distintas según la pantalla** — vehículos, cuentas bancarias y seguros tienen 2 a 4 catálogos mock independientes que no coinciden entre sí. (Sucursales ya se resolvió esta sesión — ver sección 2.)
4. **Deuda de salud de código** — nada bloqueante, pero vale la pena limpiarlo antes de que crezca: 2 archivos huérfanos con errores de sintaxis, un patrón repetido de `setState` dentro de `useEffect`, y algunas URLs/credenciales hardcodeadas.

---

## 2. Lo que ya está en buen estado

- **`ReservationContext` / `PaymentContext`**: diseño limpio, con JSDoc que referencia explícitamente las entidades del dominio (`Reservation`, `Payment`) y el mapeo de campos. Montados correctamente en `main.jsx` (`ReservationProvider` → `PaymentProvider` envolviendo `<App />`).
- **`reservationServices.js` y `PaymentServices.js`**: ya devuelven exactamente la forma de las entidades del dominio (`reservationId` en la raíz, `status: "PENDING_REVIEW"` para pagos, etc.). Conectarlos a un backend real es cambiar el cuerpo de la función, no su firma ni quién la consume.
- **`notificationService.js`**: es el único servicio que ya implementa el patrón recomendado (`VITE_API_URL` + fallback a mock). Es la plantilla a copiar para el resto.
- **Sucursales (`shared/mocks/branches.js`)**: unificado en esta sesión de trabajo — antes había dos catálogos incompatibles (uno con `id` numérico + sin `city`, otro embebido dentro de cada reserva con ids `BR-01`/`BR-02`). Ahora hay una sola fuente de verdad con `getBranchById`, las reservas guardan solo `pickupBranchId`/`returnBranchId` (foreign keys, como en `types/reservation.ts`), y la edición de sucursal de devolución ya persiste de verdad (no solo en el modal) respetando INV-013 (solo editable hasta 3 días antes de `endDate`) tanto en la UI como en el servicio.
- **`src/types/*.ts`**: buena base — cada entidad documenta sus invariantes (`INV-XXX`) con referencia a `02-domain/entities-and-rules.md`. Sirven como contrato de facto para diseñar los endpoints con el equipo de backend.

---

## 3. Brechas críticas

### 3.1 Autenticación — el bloqueante más grande

- `src/features/auth/services/authService.js` está **vacío** (0 bytes).
- `src/contexts/AuthContext.jsx` está **vacío** (0 bytes) — no hay manejo de sesión ni de token en ningún lado de la app.
- `LoginForm.jsx` sí valida el formulario y llama a `onSubmit(...)`, pero quien lo consume (`Login.jsx`) solo hace `console.log("Login:", data)` — no navega, no guarda nada, no pasa nada.
- **No hay rutas protegidas.** En `App.jsx`, todas las rutas —incluidas `/admin/users`, `/admin/bank-accounts`, `/HomeAdmin`, `/VehicleInventary`, `/Maintenance`, `/CheckStatus`— son accesibles directamente por URL sin haber iniciado sesión.
- `changePasswordService.js` sí tiene un `fetch` real, pero apunta a una URL de ejemplo hardcodeada (`http://tu-backend.com/api/auth/change-password`) en vez de `VITE_API_URL`.

**Conclusión:** hay que construirlo de cero — login/registro reales, `AuthContext` con sesión (usuario + token), el `apiClient` centralizado (sección 1 de la guía) adjuntando `Authorization` a cada request, y un guard de rutas (`ProtectedRoute` / `RequireRole`, para separar cliente de admin/super-admin). Esto no es opcional: mientras no exista, cualquier endpoint que dependa de "quién soy" (reservas del usuario logueado, panel admin) no se puede conectar de forma segura.

### 3.2 Infraestructura de conexión — diseñada, no implementada

`GUIA_CONEXION_BACKEND.md` ya deja un patrón completo (`apiClient` centralizado + `VITE_API_URL` con fallback a mock), pero hoy:

- No existe ningún archivo `.env` ni `.env.example` en el proyecto.
- No existe `src/shared/services/apiClient.js`.
- De todos los servicios reales (`reservationServices`, `PaymentServices`, `carsService`, `branchService`, `UsersMock`, `BankAccountsMock`, los 3 `CarsMock.js` de admin), **ninguno** usa el patrón todavía — todos son `Promise.resolve(mock)` puro, salvo `notificationService` (que ya lo tiene) y 3 `fetch` sueltos con URLs hardcodeadas (ver 3.4).

### 3.3 El mismo dato, formas distintas según la pantalla

`GUIA_CONEXION_BACKEND.md` ya señalaba el problema de sucursales (resuelto ahora) y el de seguros. Estos son los catálogos que siguen duplicados hoy:

**Vehículos — 4 formas distintas conviviendo:**

| Fuente | Usada en | Forma |
|---|---|---|
| `features/vehicles/data/mocks/carsMock.js` | Catálogo real de reserva (Home, filtros, checkout) | `snake_case` (`vehicle_id`, `model_id`, `category_id`, `daily_price`, `branch_id`), `status: "Disponible"` (string en español, no el enum `AVAILABLE/RENTED/MAINTENANCE` de `types/vehicle.ts`) |
| `admin/historyMaintenance/services/CarsMock.js` | Historial de mantenimiento (admin) | `id`, `imageUrl`, `modelName` suelto |
| `admin/maintenance/service/CarsMock.js` | Registro de mantenimiento (admin) | `id`, `imgUrl`, `brandName`/`modelName` sueltos |
| `admin/status/services/CarsMock.js` | Estado de flota (admin) | `vehicleId`, `imageUrl`, `brandName`/`modelName` sueltos, `branchName` como string |

La guía ya recomendaba unificar los 3 mocks de admin entre sí (sección 2.6); el hallazgo de hoy es que **tampoco coinciden con el catálogo real de `vehicles/`**, así que en total son 4 fuentes a reconciliar, no 3, antes de fijar un único contrato `Vehicle` con backend.

**Cuentas bancarias — 2 catálogos:**

- `payment/data/mocks/bankAccounts.js` (checkout del cliente): alineado con `types/bankAccount.ts` (`bankAccountId`, `accountHolder`, `qrImageUrl`, `isActive`).
- `admin/bankAccounts/services/BankAccountsMock.js` (gestión SUPER_ADMIN): forma distinta (`id`, `accountType`, `accountNumber`, `holderName`) — campos que **ni siquiera existen** en `types/bankAccount.ts`. O el tipo de dominio está incompleto, o la pantalla de admin inventó campos que el dominio no contempla todavía. Hay que decidir esto con el equipo antes de definir el endpoint de `BankAccount`.

**Seguros — 3 fuentes** (ya señalado en la guía, sigue sin resolver): `features/Insurance/data/mocks/insurance.jsx`, `features/booking/data/mocks/insurance.js`, y `usePaymentForm.jsx` importando directamente desde `features/Insurance/...`.

### 3.4 Endpoints y credenciales hardcodeados

- `admin/maintenance/hooks/useMaintenanceVehicles.js` → `fetch('http://localhost:8080/api/maintenance')` directo, sin pasar por `VITE_API_URL` ni por un `apiClient`.
- `auth/services/changePasswordService.js` → `fetch('http://tu-backend.com/api/auth/change-password')` — literalmente una URL de ejemplo que nunca se reemplazó.
- `admin/vehicles/components/VehicleForm.jsx` → sube imágenes directo a Cloudinary con `upload_preset` y `api_key` escritos en el código fuente. Funciona porque son credenciales de "unsigned upload", pero conviene moverlas a variables de entorno de todos modos, para poder rotarlas sin tocar código y no dejarlas versionadas en git.

### 3.5 Salud general del código

Corriendo `npm run lint` sobre todo `src/`: **52 problemas (49 errores, 3 warnings)**.

- **2 archivos con error de parseo** (no son JS/JSX válido siquiera): `shared/components/layout/MonthlyChart.jsx` (mezcla un componente a medio escribir con un `useRef`/`useEffect` sin importar y una declaración cortada a mitad) y `admin/historyMaintenance/pages/HystoryMaintenance.jsx` (el archivo contiene CSS, no JSX). Revisé y **ninguno de los dos está importado ni ruteado en ningún lado** — son archivos huérfanos, no rompen la app hoy, pero conviene borrarlos (o terminarlos, si en realidad falta algo) antes de que alguien los reactive sin darse cuenta.
- **Patrón repetido en ~8 archivos**: `setState` llamado de forma síncrona dentro de un `useEffect` (`FilterCalendar.jsx`, `FiltrerPrice.jsx`, `PaymentReceiptUpload.jsx`, `Quotes.jsx`, `FileDialog.jsx`, `useReservationForm.js`, entre otros) — React recomienda usar valor derivado o `useMemo` en su lugar. No rompe nada hoy, pero es el mismo tipo de ajuste repetido en varios archivos; conviene limpiarlo con una pasada dedicada en vez de ir arreglándolo uno por uno cuando aparezca.
- Detalle menor y cosmético, repetido en varios validadores de formularios: caracteres de escape innecesarios en regex (`\-`, `\.`, `\,`).
- `useReservations.js` tiene un error de orden (`loadReservations` se usa en un `useEffect` antes de declararse) — ya lo dejé anotado en la entrega anterior; funciona en tiempo de ejecución porque el efecto corre después de que el componente termina de evaluarse, pero conviene reordenarlo.

### 3.6 Otras inconsistencias ya documentadas en la guía (se listan para que este diagnóstico quede completo, sin repetir el detalle)

- **Precio como string formateado**: `CartVehicule.jsx` formatea el precio con `.toLocaleString("es-CO")` y ese string viaja hasta `usePaymentForm.jsx`, donde se vuelve a convertir con `Number(...)` — da resultados incorrectos con precios de 7 cifras.
- **`Money` vs `number`**: el dominio (`types/common.ts`) modela los montos como `{ amount, currency }`; hoy el frontend maneja todo como `number` plano (COP implícito).

---

## 4. Qué tan lejos está cada bloque de "listo para conectar"

| Bloque | Estado | Motivo |
|---|---|---|
| Notificaciones | ✅ Listo | Ya sigue el patrón `apiClient`; solo falta definir `VITE_API_URL` y probar contra el backend real. |
| Reservas y Pagos | 🟡 Casi listo | El contrato de datos ya está bien modelado (coincide con el dominio); falta generalizar el patrón `apiClient` (diseñado, no implementado) y resolver que el comprobante de pago necesita `multipart/form-data`, no JSON. |
| Vehículos (catálogo de reserva) | 🟠 Medio | Hay que decidir `snake_case` vs `camelCase` y reemplazar el `status` en español por el enum del dominio antes de fijar el contrato. |
| Autenticación | 🔴 Desde cero | El bloque más grande; bloquea además cualquier endpoint que dependa de sesión. |
| Panel de administración (flota, usuarios, cuentas bancarias) | 🟠 Medio-alto | Antes de conectar hay que unificar los catálogos duplicados (3 `CarsMock` + `BankAccountsMock`) a una sola fuente por entidad. |
| Seguros | 🟡 Pendiente | Unificar 3 fuentes a 1 antes de definir el endpoint. |

---

## 5. Orden recomendado

1. **Autenticación** (login/registro reales + `AuthContext` con sesión + `apiClient` con `Authorization` + rutas protegidas). Es la base de la que depende casi todo lo demás.
2. **Generalizar el `apiClient` + `VITE_API_URL`** (ya diseñado en la guía) a `reservationServices.js` y `PaymentServices.js` — son los que menos cambios de forma necesitan.
3. **Notificaciones**: solo falta activar la variable de entorno y probar.
4. **Resolver las duplicaciones de catálogo** (vehículos de admin x3, cuentas bancarias x2, seguros x3) — se puede hacer en paralelo al punto 2, no depende de autenticación.
5. **Limpiar deuda técnica** (archivos huérfanos, patrón `setState`-en-efecto, URLs/credenciales hardcodeadas) — no bloquea nada, se puede intercalar en tiempos muertos entre los puntos anteriores.

---

## 6. Documentos relacionados

- [`GUIA_CONEXION_BACKEND.md`](./GUIA_CONEXION_BACKEND.md) — el "cómo" detallado: patrón `apiClient`, contrato sugerido por servicio, checklist para activar cada uno.
- [`FEATURE_PAYMENT_FLOW.md`](./FEATURE_PAYMENT_FLOW.md) / [`FEATURE_RESERVATION_FLOW.md`](./FEATURE_RESERVATION_FLOW.md) — arquitectura de esos dos flujos en detalle.
