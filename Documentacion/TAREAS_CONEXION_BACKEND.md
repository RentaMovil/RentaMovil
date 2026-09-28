# ✅ Lista de Tareas — Dejar el Frontend Listo para Conectar Backend

**Fecha:** 22-09-2026
**Basado en:** [`DIAGNOSTICO_FRONTEND.md`](./DIAGNOSTICO_FRONTEND.md) (qué falta y por qué) y [`GUIA_CONEXION_BACKEND.md`](./GUIA_CONEXION_BACKEND.md) (contrato sugerido por servicio).
**Cómo usar esto:** son tareas en orden — las fases 1 y 2 son la base de la que depende casi todo lo demás; las fases 3 y 4 se pueden hacer en paralelo entre sí una vez terminada la fase 1; la fase 5 se puede intercalar en cualquier momento porque no bloquea nada. Marca cada casilla a medida que avances.

---

## Fase 0 — Preparación (antes de tocar cualquier servicio)

- [ ] Crear `web/Front-end/.env.example` con `VITE_API_URL=http://localhost:3000/api` (o la URL real que defina el equipo de backend).
- [ ] Confirmar que `.env` está en `.gitignore` (cada dev crea el suyo local a partir del `.env.example`).
- [ ] Crear `src/shared/services/apiClient.js` centralizado (`get`/`post`/`patch`/`delete` + manejo de errores + `isBackendConnected()`) — el código base ya está propuesto en la sección 1 de `GUIA_CONEXION_BACKEND.md`, solo falta crearlo.
- [ ] Definir con el equipo de backend el formato de error esperado en las respuestas (para que `apiClient` sepa leer `message` de forma consistente).

## Fase 1 — Autenticación (bloqueante, hacer primero)

- [ ] Implementar `authService.js` (hoy vacío): `login(email, password)`, `register(data)`, con llamadas reales vía `apiClient` (`POST /auth/login`, `POST /auth/register`).
- [ ] Implementar `AuthContext.jsx` (hoy vacío): guardar `{ user, token }` en estado + `localStorage`/`sessionStorage`, exponer `login()`, `logout()`, `isAuthenticated`, y el rol del usuario (`role`) para diferenciar cliente/admin/super-admin.
- [ ] Envolver `<App />` con `AuthProvider` en `main.jsx` (mismo patrón que `ReservationProvider`/`PaymentProvider`).
- [ ] Conectar `Login.jsx`: reemplazar el `onSubmit={async (data) => console.log(...)}` actual por la llamada real a `authService.login(...)` + `AuthContext.login(...)` + navegación a la pantalla correspondiente según el rol devuelto.
- [ ] Hacer lo mismo en `RegisterForm.jsx` (hoy también simulado).
- [ ] Actualizar `apiClient.js` para adjuntar `Authorization: Bearer <token>` en cada request una vez que exista sesión.
- [ ] Crear un componente `ProtectedRoute` (o `RequireRole`) en `shared/components/` y envolver en `App.jsx` todas las rutas que hoy son públicas sin deberlo ser: `/admin/users`, `/admin/bank-accounts`, `/HomeAdmin`, `/VehicleInventary`, `/Maintenance`, `/CheckStatus`, `/Contract`, `/ContractHistory`, `/HistorialReservation`, `/Notification`, `/NotificationAdmin`.
- [ ] Reemplazar en `changePasswordService.js` la URL hardcodeada `http://tu-backend.com/api/auth/change-password` por `apiClient` + `VITE_API_URL`.
- [ ] Confirmar con backend los endpoints restantes de este bloque: `POST /auth/verify-email`, `POST /auth/verify-code` (ya hay pantallas para esto: `EmailVerification.jsx`, `CodeVerification.jsx`, `ChangePasswordLogin.jsx` — falta conectarlas).

## Fase 2 — Generalizar el patrón `apiClient` a Reservas y Pagos

*(Estos dos servicios ya devuelven la forma correcta de las entidades del dominio — este bloque es el que menos cambios de forma necesita.)*

- [ ] `reservationServices.js`: reescribir `getReservations`, `createReservation`, `cancelReservation` y `updateReturnBranch` siguiendo el patrón `isBackendConnected()` (mover la simulación actual a una función interna de fallback, igual que hace `notificationService.js`).
- [ ] `PaymentServices.js`: reescribir `createPayment` con el mismo patrón. **Atención:** este endpoint necesita `multipart/form-data` (por el archivo del comprobante), no JSON — el `apiClient` genérico de la Fase 0 solo cubre JSON, hay que agregarle un método aparte para `FormData` o hacer un `fetch` puntual acá.
- [ ] Probar el flujo completo en navegador con `VITE_API_URL` apuntando a un backend real o de pruebas: crear reserva → pagar → ver en historial → editar sucursal de devolución.
- [ ] Confirmar con backend que valida del lado del servidor (no solo el front) las invariantes ya documentadas: INV-002 (`vehicleId` inmutable), INV-003 (`endDate` solo se extiende), INV-008 (`totalAmount` recalculado en servidor), INV-013 (sucursal de devolución editable solo hasta 3 días antes).

## Fase 3 — Notificaciones (la más simple, se puede hacer en paralelo a la Fase 2)

- [ ] Definir `VITE_API_URL` en `.env` de pruebas.
- [ ] Confirmar que el backend expone `GET /notifications` y `PATCH /notifications/:id/read` devolviendo la forma de `types/notification.ts`.
- [ ] Verificar que el backend garantiza `INV-001` (toda notificación tiene al menos uno de `reservationId/invoiceId/paymentId/maintenanceId`).
- [ ] Probar en navegador — no debería requerir más cambios de código, es el único servicio que ya sigue el patrón correcto.

## Fase 4 — Unificar catálogos duplicados (se puede hacer en paralelo a la Fase 2, no depende de Auth)

- [ ] **Vehículos:** decidir una sola forma (recomendado: alinear a `types/vehicle.ts` — `camelCase`, `status` en el enum `AVAILABLE/RENTED/MAINTENANCE`, no en español) y migrar `features/vehicles/data/mocks/carsMock.js` a esa forma.
- [ ] Unificar los 3 `CarsMock.js` de admin (`historyMaintenance/services/`, `maintenance/service/`, `status/services/`) en un solo servicio, p. ej. `features/admin/vehicles/services/vehicleAdminService.js`, exponiendo `getFleetStatus()`, `getMaintenanceHistory()`, `getVehiclesInMaintenance()`.
- [ ] Decidir si ese catálogo de admin es el mismo `Vehicle` que usa el flujo de reserva (recomendado) o uno separado, y documentar la decisión.
- [ ] **Cuentas bancarias:** decidir con el equipo si `admin/bankAccounts/services/BankAccountsMock.js` (`accountType`, `accountNumber`, `holderName`) debe incorporarse a `types/bankAccount.ts`, o si esos campos no son necesarios y hay que alinear la pantalla de admin a la forma ya usada en `payment/data/mocks/bankAccounts.js` (`bankAccountId`, `accountHolder`, `qrImageUrl`, `isActive`).
- [ ] **Seguros:** unificar `features/Insurance/data/mocks/insurance.jsx`, `features/booking/data/mocks/insurance.js` y el import directo en `usePaymentForm.jsx` a una sola fuente (`InsuranceType`, según `types/insuranceType.ts`).
- [ ] Una vez unificado cada catálogo, aplicarle el mismo patrón `apiClient` de la Fase 0/2.

## Fase 5 — Limpieza de deuda técnica (no bloquea nada, intercalar cuando haya tiempo)

- [ ] Borrar (o terminar, si falta algo real) los 2 archivos huérfanos con error de sintaxis: `shared/components/layout/MonthlyChart.jsx` y `admin/historyMaintenance/pages/HystoryMaintenance.jsx` — ninguno está importado en ningún lado hoy.
- [ ] Revisar y corregir el patrón `setState` síncrono dentro de `useEffect` en: `FilterCalendar.jsx`, `FiltrerPrice.jsx`, `PaymentReceiptUpload.jsx`, `Quotes.jsx`, `FileDialog.jsx`, `useReservationForm.js` (usar valor derivado o `useMemo` en vez de sincronizar con un efecto).
- [ ] Reordenar `useReservations.js` para que `loadReservations` se declare antes de usarse en el `useEffect`.
- [ ] Mover las credenciales de Cloudinary hardcodeadas en `VehicleForm.jsx` (`upload_preset`, `api_key`) a variables de entorno.
- [ ] Reemplazar `fetch('http://localhost:8080/api/maintenance')` en `useMaintenanceVehicles.js` por `apiClient` + `VITE_API_URL`.
- [ ] Separar "precio numérico" (para cálculos) de "precio formateado" (solo para mostrar) en `CartVehicule.jsx` / `usePaymentForm.jsx`, para no arrastrar el bug de precios de 7 cifras.
- [ ] Decidir si se envuelven los montos como `Money { amount, currency }` (como pide `types/common.ts`) al armar los payloads de reserva/pago, o si se documenta explícitamente que el frontend asume siempre COP.
- [ ] Limpiar los warnings menores de `eslint` (variables no usadas, escapes innecesarios en regex) — cosmético, sin prisa.

---

## Checklist rápido de "¿ya puedo conectar este servicio?"

Antes de dar un servicio por conectado, confirmar:

- [ ] Usa `apiClient` (o el patrón `isBackendConnected()`), no `Promise.resolve(mock)` ni un `fetch` suelto con URL hardcodeada.
- [ ] La forma de los datos que envía/recibe coincide con el tipo correspondiente en `src/types/*.ts`.
- [ ] Las invariantes de negocio (`INV-XXX`) relevantes están validadas también del lado del backend, no solo en el frontend.
- [ ] Se probó el flujo completo en navegador (no solo el endpoint aislado), porque varias pantallas comparten `ReservationContext`/`PaymentContext`/`AuthContext`.
