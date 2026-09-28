# Trabajo en el móvil (`app_mobile/Frontend`)

Qué se cambió, por qué, y qué se verificó. Los errores y las trampas están en
`LECCIONES-APRENDIDAS.md`; aquí está el **qué**.

**Alcance:** 17 archivos nuevos, 48 modificados.

---

## Principio rector

**El web manda.** `web/Front-end/src/index.css` es la autoridad de diseño:
colores, tipografía y espaciado. El móvil replica, no inventa.

Consecuencia práctica: cuando algo se ve mal en el móvil, la pregunta no es
"¿qué color ponemos?" sino "¿qué dice `index.css`?".

---

## 1. Sistema de diseño

### Fuentes

`index.css` declara:

```css
--sans:    'Inter', system-ui, ...;
--heading: 'Poppins', system-ui, ...;
--mono:    ui-monospace, Consolas, monospace;
```

El móvil no tenía ninguna. Se añadieron `@expo-google-fonts/inter` y
`@expo-google-fonts/poppins`, y se creó `src/theme/fonts.ts` que centraliza los
pesos.

Se empaquetan con `@expo-google-fonts` en vez de pedirlas por CDN, que es la
diferencia clave con el web: el móvil **sí** renderiza en Inter y Poppins aunque
no haya red.

### Escala tipográfica

`src/theme/constants/typography.ts` devuelve `Record<TextRole, TextStyle>`.

**El detalle que costó un error:** la anotación de tipo de retorno **no es
opcional**. Sin ella, TypeScript ensancha `fontWeight` a `string` y
`StyleSheet.create` deja de aceptar el objeto.

```ts
// MAL: fontWeight se widenea y StyleSheet.create se queja
export const createTextStyles = (colors) => StyleSheet.create({ ... });

// BIEN
export const createTextStyles = (colors): Record<TextRole, TextStyle> => ({ ... });
```

El interlineado sale del CSS: `font: 18px/145% var(--sans)`, o sea 1.45. Los
`lineHeight` de la tabla son el redondeo de `tamaño × 1.45`.

### Sombras y radios

`shadows.ts` estaba roto y `radius.ts` se amplió. El token `shadow` es **el único
que no es copia literal** del CSS: el web declara dos capas con desplazamiento y
desenfoque, y React Native solo admite `shadowColor` + `shadowOffset` +
`shadowRadius`. Se conserva el color de la primera capa y se documenta.

---

## 2. Paleta: los 4 temas

Antes los temas se llamaban `light`, `dark`, `ocean` y `gray`. **`ocean` y `gray`
no tenían contraparte en el web**: divergían en 14 tokens y eran colores
inventados. Se eliminaron.

Ahora los cuatro se llaman igual que los del web y copian sus valores.

### Verificación real (token a token)

El móvil usa nombres semánticos (`background`, `textHeading`) y el web nombres
CSS (`--bg`, `--text-h`), así que hace falta un mapa explícito para comparar:

| | |
|---|---|
| Tokens por tema | 26 |
| Temas | 4 |
| **Total de valores** | **104** |
| Comparables (con variable CSS equivalente) | 79 |
| **Idénticos** | **73 (92.4%)** |
| Distintos | 6 |

**Las 6 diferencias, y por qué:**

- **4 son el token `shadow`**: el color coincide, pero el CSS tiene dos capas con
  desplazamiento y React Native no puede representarlas. Decisión consciente.
- **2 son `backgroundCard`** en `dark` (`#1C1C1C` vs `#2d2e2f`) y `skylight`
  (`#FFFFFF` vs `#f4f7fc`). **Ojo: pueden ser un error en mi propio mapa**, no
  una divergencia real. Si se revisa esta tabla, empezar por aquí.

**5 tokens sin equivalente en CSS por diseño** (documentados en el propio
archivo): `label`, `overlay`, `primarySurface`, `successSurface`,
`errorSurface`. El web usa `color-mix` y RGBA en el sitio; en el móvil se derivan
de la misma familia de color.

---

## 3. Módulo de notificaciones

11 archivos nuevos, siguiendo el patrón
`features/<f>/{pages,components,services,context,utils}`:

```
features/notification/
├── components/NotificationCard.tsx           55 líneas
├── components/NotificationDetailModal.tsx   94
├── components/NotificationFilter.tsx        68
├── context/NotificationContext.tsx         136
├── pages/NotificationPage.tsx              110
├── services/notificationService.ts          52
└── utils/notificationUtils.ts               99
```

Más los `*.styles.ts` correspondientes y `src/types/notification.ts`.

El context va montado **por encima de las tabs**, así que la campana de la barra
puede leer el contador de no leídas sin que la lista se cargue otra vez.

**Se decidió que consumiera la API, no un mock local**, porque el objetivo era
que la app quedara conectada. Por eso se añadió la colección `notifications` a
`db.json` y la ruta `PATCH /notifications/:id/read` a la API mock.

Esa ruta va **sin `requireAuth`** a propósito: el cliente web la consume y su
`httpClient` solo adjunta el `Bearer` cuando hay sesión en memoria. Si algún día
se le quiere poner auth, hay que revisar ese cliente primero.

---

## 4. Marca unificada

La palabra "RentaMovil" salía en cuatro sitios con dos sistemas distintos:

| Dónde | Cómo se veía |
|---|---|
| Las 3 tabs | componente `BrandLogo` (bicolor) |
| Login y registro | **otra copia** del mismo componente |
| `/account` | **string plano** `title: "Renta Móvil"` → un solo color |

Se creó `shared/components/Brand/BrandLogo.tsx` como fuente única y se usó como
`headerTitle` por defecto del `Stack` raíz. Se borraron las tres copias y sus
estilos muertos.

Verificado en las cuatro pantallas con valores idénticos:
`rgb(242, 192, 99)`, `Poppins_700Bold`, `19px`.

El patrón de Expo Router es: `headerTitle` gana a `title`, y un
`headerTitle` a nivel de pantalla **no** sobrescribe el de `screenOptions`. Por
eso "Notificaciones" lleva su nombre en el cuerpo de la página, no en el header.

---

## 5. Pantalla de registro

El contrato **ya existía**: `authService.register()`, el tipo `RegisterRequest` y
el namespace `register` de i18n con los 7 campos y todos los mensajes de
validación. **Lo que faltaba era la pantalla.**

Los campos van en filas de 2/1/2/2. El payload usa `first_name` / `last_name` en
snake_case porque `users` es la única colección de la API en ese formato.

---

## 6. Guard de autenticación

Reescrito. Antes redirigía en cualquier cambio de estado; ahora **solo cuando hay
desajuste real** entre la sesión y la ruta. Eso arreglaba un bugmolesto: al
recargar `/account` botaba al login.

Login y registro llevan a `/menu`, no a Inicio.

---

## 7. Restyle según el web

~17 archivos de reserva y pago, siguiendo el vocabulario CSS del web:

- Separador punteado
- Badges con el color de acento
- Números de cuenta en tipografía monoespaciada
- Aviso de advertencia
- Tarjetas con borde de 1px y radio 20

**Seguro:** las descripciones estaban corruptas (acentos perdidos). Se
arreglaron para que coincidieran **carácter por carácter** con el mock del admin
del web, y se reestilizaron según `InsuranceSelector.css`.

**Sucursales:** el selector se estilizó con icono, nombre, dirección, etiqueta de
ciudad y estado de "sin resultados". Se separó `inputContainer` en
`inputButton` / `inputButtonText`.

**Proceso:** los 4 pasos se.connertieron de rejilla en **carrusel** deslizante,
con `pagingEnabled` para que salte de una tarjeta entera. Es lo que espera el
dedo. Hecho a mano con `FlatList`, sin dependencias nuevas.

**Pago:** el QR bancario se eliminó (decisión del proyecto). Se puso un botón de
**copiar número**, que usa la Web Clipboard API porque en nativo haría falta
`expo-clipboard`. En nativo el número está a la vista y se copia a mano.

---

## 8. Auditoría de i18n

Comparados los 4 idiomas de los dos proyectos:

| | Resultado |
|---|---|
| Web, claves que faltaban | 20, repartidas en en/fr/pt |
| Móvil, claves que faltaban | 3 |
| `maintenanceForm.options.*` | Roto **en los 4** idiomas del web |
| Claves muertas | 5 (rol, estado, último acceso, y sus valores) |

**Un hallazgo importante:** `cartVehicule.type` y `cartVehicule.location` del
web son **claves muertas con valores basura**. Los valores de la app son los
correctos. **No se "arreglaron" para que coincidieran con el web**, porque
copiar basura sería propagar un error.

Las claves muertas se borraron en vez de dejarlas: comprobar que tu origen tenía
**0 usos** antes de borrar.

---

## 9. Detalles técnicos que quedaron documentados en el código

- **Iconos de Leaflet**: Vite no resuelve las URLs por defecto, hay que
  importarlas como módulo. Mismo patrón en `MapComponents.jsx`.
- **`form-image` y el QR**: se documentó por qué el botón existe aunque en nativo
  no haga nada, para que nadie lo borre sin leer.
- **`Payment` exige `receiptFileUrl`**: sin él un admin no tiene nada que revisar.

---

## 10. Verificación

- `npx tsc --noEmit`: **0 errores**
- Emojis en el código: **0** (las banderas de idioma se conservaron a propósito)
- En el navegador (Expo web): la marca se ve igual en las 4 pantallas
- La API responde y el flujo de sesión funciona

---

## 11. Pendiente del móvil

| Qué | Por qué |
|---|---|
| **Persistencia del tema** | El web guarda el tema en `localStorage` y honra `prefers-color-scheme`; el móvil es un `useState("light")` pelado. `AsyncStorage` ya es dependencia. |
| **Los mocks del móvil** | `features/*/mocks/` sigue alimentando parte de la app. |
| **`notification.ts`** | Es la **única excepción** a la regla "`src/types/` es espejo del web": el web declara un tipo formal en camelCase con `notificationId` UUID, pero la API sirve snake_case con `notification_id` numérico. Se replica lo que llega. |
