# Índice — Documentación del trabajo de paridad
**Rama:** `feat/notification`
**Último commit:** `a60a139 Feat: add app_movile` (2026-09-25)
**Pendiente de commit:** 84 archivos (19 nuevos, 65 modificados)

---

## Por dónde empezar

| Si quieres… | Lee |
|---|---|
| **Aprender los errores y cómo evitarlos** | [`LECCIONES-APRENDIDAS.md`](./LECCIONES-APRENDIDAS.md) |
| Saber qué se hizo en el **web** | [`TRABAJO-WEB.md`](./TRABAJO-WEB.md) |
| Saber qué se hizo en el **móvil** | [`TRABAJO-MOVIL.md`](./TRABAJO-MOVIL.md) |
| Enseñar la **API mock** a tu compañero | [`API_MOCK_TELEMETRIA_GPS.md`](./API_MOCK_TELEMETRIA_GPS.md) |
| Conocer el **sistema de diseño** | [`RentaMovil-Sistema-de-Diseno.html`](./RentaMovil-Sistema-de-Diseno.html) |

---

## Los dos proyectos

El repo tiene **dos clientes** que comparten la API mock, no el código:

| | `web/Front-end` | `app_mobile/Frontend` |
|---|---|---|
| Stack | React + Vite | Expo / React Native |
| Enrutado | `react-router-dom` v7 | `expo-router` |
| UI | HTML + CSS | `View` / `Text` / `StyleSheet` |
| Roles | ADMIN ve `/HomeAdmin` | ADMIN ve las mismas pantallas |

La regla del proyecto: **el web manda en diseño y datos; el móvil replica.**

---

## Qué se hizo, de un vistazo

### Móvil (`app_mobile`) — 17 archivos nuevos, 48 modificados

- **Módulo de notificaciones** completo: 11 archivos, con context, service,
  filtros y modal de detalle
- **Sistema de diseño**: fuentes Inter y Poppins empaquetadas, escala tipográfica,
  sombras, radios y tarjetas
- **Paleta**: los 4 temas ahora copian los valores de `index.css` del web
- **Pantalla de registro** y **guard de autenticación** reescrito
- **Restyle** de reserva, pago, seguros y sucursales según el CSS del web
- **Marca unificada**: un solo componente `BrandLogo` en las 4 pantallas
- **Auditoría de i18n** en los 4 idiomas

### Web (`web/Front-end`) — 1 carpeta nueva, 17 archivos modificados

- **Módulo de Ubicación de la flota** (EP-006 / HU-GPS-001): mapa con la posición
  del GPS, refresco automático cada 15 s y aviso de tracker desconectado
- **API**: 5 rutas nuevas (`/gps/*`, `PATCH /auth/me`) y 3 colecciones nuevas
- **Arreglo del `@import` de Google Fonts**: el web **nunca** renderizó en
  Inter/Poppins
- **Perfil editable** con `PATCH /auth/me` y lista blanca de campos
- **Footer del tema `light`**: variable `--footer-bg` para que se distinga del
  fondo
- **Selector de temas** con miniaturas de colores (el JSX existía, el CSS no)
- **Header del perfil** alineado; modales solo con la X
- **Enlace roto** del menú corregido: `/VehicleInvento1ry` → `/VehicleInventory`

---

## Lo que quedó pendiente

| # | Qué | Por qué |
|---|---|---|
| 1 | **Escenario 2 del GPS (403)** | Decidido no hacerlo: falta `requireRole` en el backend. El frontend ya bloquea la vista. |
| 2 | **Historial de rutas** | El enlace del menú apunta a `/History`, que es el historial de **mantenimientos**. Bug preexistente. |
| 3 | **`.gitattributes`** | No existe y `core.autocrlf = true`: en Linux se cambian los finales de línea de archivos enteros. |
| 4 | **Warning de React** | `Each child in a list should have a unique "key" prop` en el componente `Home`. |
| 5 | **Migrar mocks a la API** | 9 módulos siguen leyendo datos quemados. Ver el detalle en `TRABAJO-WEB.md`. |
| 6 | **Coherencia del vehículo** | `status: "En mantenimiento"` con una rental `IN_PROGRESS`. |
| 7 | **QR del pago** | Se decorator en el móvil: el número de cuenta se copia a mano. |

---

## Credenciales de prueba

| Correo | Contraseña | Rol |
|---|---|---|
| `nox@rentamovil.com` | `Admin123` | ADMIN |
| `nicolerv18007@gmail.com` | `niki123` | ADMIN |
| `elcapitojuan@gmail.com` | — | CLIENT |

> `nox` tenía un `password_hash` placeholder (`$2a$12$reemplazaEsteHashGenerado`),
> que **nunca fue un hash válido**: mide 32 caracteres donde bcrypt exige 60, y
> `compareSync` devuelve `false` para cualquier contraseña. Se sustituyó por un
> hash real de `Admin123`; sin eso no hay ninguna cuenta de admin utilizable.

---

## Documentación anterior

Los documentos que ya existían de la sesión previa (`RESUMEN_CAMBIOS_31-08-2026.md`,
`FEATURE_PAYMENT_FLOW.md`, `GUIA_CONEXION_BACKEND.md`, etc.) siguen vigentes y
**no se tocaron** en este trabajo.
