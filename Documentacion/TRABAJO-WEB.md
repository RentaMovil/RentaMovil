# Trabajo en el web (`web/Front-end`)

Qué se cambió, por qué, y qué se verificó. Lo mismo está documentado en
`LECCIONES-APRENDIDAS.md`, pero desde el punto de vista de **qué** se hizo.

**Alcance:** 1 carpeta nueva, 17 archivos modificados.

---

## 1. Módulo de Ubicación de la flota (EP-006 / HU-GPS-001)

### Qué pedía la historia

> Como administrador, quiero ver la ubicación actual de un vehículo mientras está
> alquilado, para poder supervisar la flota en tiempo real.

Dos criterios de aceptación: que el admin vea la última posición (lat/long) de
una rental `IN_PROGRESS`, y que un `CLIENT` reciba 403.

### Decisión de alcance

La API **no tenía contrato de GPS**, así que hubo que crearlo. Se decidió
implementarlo en la **API mock**, no como mock del frontend, por una razón
concrea: el criterio del 403 solo se puede verificar contra un endpoint real. Un
mock del frontend no puede responder 403.

### Archivos creados

```
src/features/admin/vehicleLocation/
├── components/VehicleMap.jsx          mapa Leaflet, una sola marca
├── hooks/useVehicleLocations.js      carga + refresco automático
├── pages/VehicleLocation.jsx         la pantalla
├── pages/VehicleLocation.css         estilos (prefijo vl-)
└── services/locationService.js       llamadas a /gps
```

### Rutas de API añadidas

| Ruta | Para qué |
|---|---|
| `GET /gps/vehicles` | Última posición de cada vehículo con rental `IN_PROGRESS` |
| `GET /gps/vehicles/:id` | Un vehículo |
| `GET /gps/vehicles/:id/track` | Historial de posiciones |

Las tres van **antes** de `server.use(router)`, porque cruzan tres colecciones y
json-server se las comería si fueran después.

### Colecciones añadidas a `db.json`

- **`gpsDevices`** (1): el tracker existe pero **la conexión no está hecha**:
  `connected: false`, `status: PENDING_CONNECTION`, `last_seen_at: null`.
- **`rentals`** (5): los ids 101, 102, 105 y 108 **no son inventados**, son los
  mismos a los que ya apuntaban las notificaciones.
- **`gps`** (8): un recorrido histórico de Bogotá Centro a Salitre.

### Un cambio de requisitos a mitad de camino

Al principio el módulo **dibujaba la ruta** (polilínea) y decía "8 puntos en el
recorrido". Seяснилось que eso pertenece al apartado de **historial de rutas**,
que es otro. Se quitó la polilínea y se dejó solo la posición actual.

`getTrack` se mantiene en el service, porque es el endpoint que necesitará el
módulo de historial de rutas cuando exista.

### El refresco automático

```js
export const REFRESH_MS = 15000;
```

Con tres detalles que importan:

1. **No se solapan**: si una petición sigue en vuelo cuando toca el siguiente
   tick, se salta ese tick.
2. **Se para si la pestaña no está delante**, y refresca al volver.
3. **Un fallo en segundo plano no borra lo que ya había**: conserva la última
   posición y solo anota la hora del último acierto.

Verificado interceptando `fetch`: 3 peticiones en 20 segundos sin tocar nada.

### El mapa no se recentra solo

El centro se recalcula **solo** cuando el usuario elige otro vehículo. Si no,
el mapa saltaría cada 15 segundos mientras se está usando.

### Honestidad del dato

El tracker está desconectado, así que la posición es del último reporte, no una
señal en vivo. Para no mentir, el backend expone el estado del dispositivo y la
interfaz avisa:

> Geotab R-809 no está conectado: la posición es del último reporte.

Cuando el tracker se conecte, `connected` pasará a `true` y el aviso desaparece
solo, sin tocar el frontend.

---

## 2. Arreglo del `@import` de Google Fonts

El hallazgo más importante del trabajo, porque llevaba tiempo unnoticed.

```css
@import url('https://googleapis.com');   /* mal: responde 404 con HTML */
```

`index.css` declaraba `Inter` y `Poppins` en `--sans` y `--heading`, pero **no
había ningún `@font-face`**: el navegador descartaba el import y el texto caía al
fuente del sistema.

La comprobación que lo destapó:

```js
document.fonts.size   // 0 = no hay ninguna fuente cargada
```

Medido antes y después: **0 → 44** (Inter 400–800, Poppins 500–700).

Se usó la URL que ya estaba en `RentaMovil-Sistema-de-Diseno.html`, con los
mismos pesos.

---

## 3. Perfil editable

El perfil **no tenía forma de editar**. No solo faltaba el botón: **no existía
endpoint**. La API solo tenía `PATCH /auth/me/password`.

### `PATCH /auth/me` con lista blanca

```js
const permitidos = { first_name, last_name, phone, username };
```

Lo que **no** está en la lista se ignora aunque venga en el cuerpo. Probado:

```
PATCH { role: "SUPER_ADMIN", status: "BLOCKED", email: "hack@evil.com", password_hash: "x" }
  -> 400  ignored: ["role","status","email","password_hash"]

GET /auth/me despues:
  role = ADMIN    OK, no escalo
  status = ACTIVE  OK, no cambio
```

Un usuario **no puede cambiarse su propio rol desde el perfil**. El correo queda
fuera porque eso necesita verificación, y la contraseña tiene su propia ruta.

### Otros arreglos del perfil

- El nombre se separó en nombre y apellido (la API los entrega separados).
- Se **quitaron** rol, estado y último acceso: el perfil es para la persona, no
  para el administrador.
- Se añadió el campo **usuario**, que la API traía y no se mostraba.
- El enlace de cambiar contraseña occupies ahora **debajo** del correo
  (`grid-column: 1 / -1`). Antes caía **al lado**, porque el formulario es de dos
  columnas.

---

## 4. Header del perfil

Tres bugs reales, medidos:

| Problema | Antes | Después |
|---|---|---|
| Botón de volver sobre el estado | ambos en `x=76` | `x=76` y `x=194` |
| Botones desalineados | volver `y=139`, acciones `y=104` | ambos en `y=184` |
| Botones sin fondo | `rgba(0,0,0,0)` | `rgb(242, 192, 99)` |

**Causa 1:** `variant="overlay"` del `ButtonBack` es `position: absolute`, con
`left: 2; top: 1;` **sin unidad** (CSS inválido, se descarta). Se cambió a
`variant="normal"`. No se tocó el componente compartido: solo `AccountView` usaba
`overlay`.

**Causa 2 (regresión propia):** al mover `.actions` dentro de `.header-page` para
alinear, los botones pasaron a quedar cubiertos por una regla que **ya existía**:

```css
.header-page button, .header-page a { background: transparent !important; }
```

Ese `!important` le ganaba a `background-color: var(--button)`. Se excluyó con
`:not(.icon-btnC)`.

---

## 5. Footer del tema `light`

El problema no era contraste (14:1, se leía bien) sino que en `light` **`--navbar`
y `--bg` eran idénticos** (`#FAFAFA`), así que el footer se perdía en la página.

Se añadió una variable propia, porque navbar y footer comparten `--navbar` y lo
usan **cuatro** barras de navegación:

```css
:root.light { --navbar: #FAFAFA;  --footer-bg: #F1F5F9; }
```

A los otros tres temas se les puso su propio `--navbar` como valor, así que **su
aspecto no cambió ni un píxel**. `#F1F5F9` da 13.4:1 con el texto `#1F2937`, muy
por encima del 4.5:1 de WCAG AA.

---

## 6. Selector de temas

**El bug de fondo:** el JSX ya tenía

```jsx
<div className={`theme-preview preview-${id}`}></div>
```

pero **no existía ningún CSS** para esa clase. El div salía de 0×0: invisible.
No había forma de elegir tema.

Se le dio una miniatura con barra, superficie y punto de acento. Los colores van
**literales**, porque con un solo tema activo `var(--bg)` solo devuelve el color
del actual y todas las miniaturas saldrían iguales.

Los nombres tampoco cuadraban, y poner la miniatura al lado lo hacía evidente:

| Nombre viejo | Realidad |
|---|---|
| "Verde Oscuro" | fondo `#030712`, **azul noche** |
| "Azul Oscuro" | fondo `#121212`, **gris neutro** |
| "Modo Verde claro" | acento `#F2C063`, **ámbar** |

También: los modales de tema e idioma ya tenían el botón "Cancelar" y la X. Se
quitó el de cancelar y la X quedó sola en la esquina superior derecha.

---

## 7. Enlace roto del menú

```diff
- <Link to="/VehicleInvento1ry" ...>   // con un "1" de más
+ <Link to="/VehicleInventory" ...>
```

Ese enlace llevaba a una ruta inexistente: "Inventario de Vehículos" no abría
nada. Venía de antes.

Aprovechando se hizo un barrido: los **16 enlaces** de `AdminPanel` y
`NavBarAdmin` contra las **31 rutas** de `App.jsx`. **0 rotos**, así que no había
otro escondido.

---

## 8. Marca unificada

La palabra "RentaMovil" aparecía en **cuatro sitios con dos sistemas distintos**:
tres tabs con un componente `BrandLogo`, login y registro con copias del mismo
componente, y `/account` con un **string plano** que salía en un solo color.

Se creó `shared/components/Brand/BrandLogo.tsx` como fuente única, se usó como
`headerTitle` por defecto del `Stack`, y se borraron las copias.

Verificado: las cuatro pantallas con los mismos valores exactos
(`rgb(242, 192, 99)`, `Poppins_700Bold`, `19px`).

---

## 9. Módulos que siguen con datos quemados

Fuera de alcance, pero conviene saberlo. **9 mocks** en el frontend:

| Mock | Colección que necesitaría | ¿La API la tiene? |
|---|---|---|
| `UsersMock.js` | `users` | **Sí** (5 registros) |
| `notificationsMock.js` | `notifications` | **Sí** (ya tiene fallback) |
| `carsMock.js` | `vehicles` | Sí, pero solo 1 |
| `ReservationsMock.js` | `rentals` | Sí, pero el mock es mucho más rico |
| `reservationsMocks.js` | `rentals` | Sí, misma limitación |
| `BankAccountsMock.js` | `bankAccounts` | No existe |
| `BranchesMock.js` | `branches` | No existe |
| `InsuranceTypesMock.js` | `insuranceTypes` | No existe |
| `stepsMocks.js` | — | No aplica (texto de interfaz) |

**El más fácil y el que más duele: usuarios.** La API ya tiene `users` con roles
reales; solo difieren los nombres de campo (`firstName` vs `first_name`), y eso
se resuelve con un mapper. Hoy el admin ve usuarios inventados, y si cambia un
rol desde esa pantalla no le pasa nada al sistema.

**El caro: reservas.** El mock trae objetos anidados (`customer`, `vehicle`,
`payment`, `insurance`, `pickup`…) que la API no tiene.

**Dos fuentes duplicadas que conviene decidir:**

- Sucursales: `admin/branches/services/BranchesMock.js` **y**
  `shared/mocks/branches.js`. El `branchService.js` tiene `IS_MOCK = true` con el
  `fetch` real comentado.
- Vehículos: `carsService` no hace `fetch` (resuelve con el mock) y lo usan
  `HomeAdmin`, `Home`, `HomeS` y `notificationService`; pero `inventoryService`
  sí consulta `/vehicles`.

---

## 10. `db.json`: qué se respeta

El archivo es **compartido con el compañero**, así que el trabajo se limitó a
lo necesario:

- `vehicles` **sin tocar** (0 líneas modificadas)
- `sessions` restaurado a las **7 filas** del repo tras las pruebas
- `last_login` restaurado a su valor original (es runtime: cambia en cada login)
- A `users` solo se le añadió un cambio: `nicolerv18007@gmail.com` como ADMIN
