# Lecciones aprendidas

Lo que costó tiempo durante este trabajo. Está aquí para que no se repita.

---

## 1. Nunca escribas texto con PowerShell

**El problema.** La consola de PowerShell en Windows usa una codificación
distinta a la de los archivos. Escribir acentos, `ñ` o comillas por línea de
comandos **corrompe el texto** y a veces rompe el archivo entero.

Pases en los que pasó:

| Qué intentaba | Qué pasó |
|---|---|
| Comparar contraseñas con `node -e "..."` | Se comió las comillas, error de sintaxis |
| Imprimir un nombre con `ñ` | Salió `Ubicaci?n` en pantalla |
| Buscar texto con acentos en un regex | Error de "índice de matriz no válido" |
| Ver unos hashes con bcrypt | excepción `MODULE_NOT_FOUND` |
| `Out-File` para copiar un archivo | **Le metió un BOM** que después rompía `JSON.parse` |

Peor: más de una vez **creí que el código estaba corrupto cuando solo era la
consola**. Llegué a pensar que un acento estaba mal en un archivo y casi lo
"arreglé" sobre un archivo que estaba bien.

**La regla.** Para cualquier cosa con texto:

- Código de un archivo → herramienta de edición.
- Script que lee o escribe archivos → **archivo `.cjs`/`.mjs` en el temp**,
  ejecutado con `node`.
- Ver texto con acentos → script de Node, no `console.log` de PowerShell.

Si ves `?` donde debería haber un acento, **no arregles el archivo**:
mira primero con Node qué hay realmente dentro.

```js
const roto = p.match(/\uFFFD/g);        // U+FFFD = caracter de reemplazo
console.log(b ? roto.length : 0);       // 0 = el archivo esta bien
```

---

## 2. json-server reescribe `db.json` por sorpresa

**El problema.** `json-server` carga `db.json` **en memoria** y lo reescribe
**entero** cada vez que algo muta. Así que si editas `db.json` con el servidor
corriendo, tu cambio se pierde en el siguiente login (que escribe `last_login`).

Pasó de verdad: restauré un campo a su valor original, y en la petición
siguiente volvió el valor viejo, porque el servidor todavía tenía el suyo en
memoria.

**La regla.** Antes de tocar `db.json`:

```powershell
# Parar TODO el arbol de node --watch, no solo el hijo
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -match 'mock-server' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
```

**Y ojo con `node --watch`:** si matas solo el proceso hijo, el padre lo
**resucita**. Por eso el comando de arriba mata los dos, y por eso los
`EADDRINUSE` en bucle eran siempre el mismo proceso zombie.

---

## 3. El editor de texto no respeta los saltos de línea

Distintas herramientas, distinto resultado:

| Archivo | EOL original | Qué hace la herramienta de edición |
|---|---|---|
| `db.json` | LF | LF (ok) |
| `mock-server.cjs` | **CRLF** | lo pasa a LF → diff gigante |
| `Traductions/*.json` | **CRLF** | LF → **todo el archivo aparece como modificado** |
| `index.css` | **CRLF** | LF |
| `Account.css` | **CRLF** | LF |
| `VehicleLocation.css` | LF | LF (ok) |

**La regla.** Antes de editar un archivo:

```js
const s = require("fs").readFileSync(archivo, "utf8");
console.log(s.includes("\r\n") ? "CRLF -> usa Node" : "LF -> puedes usar el editor");
```

Si es CRLF, edita con Node preservando el EOL. Y cuando uses regex sobre un
archivo CRLF, `\\n` no casa: usa `\\r?\\n`.

---

## 4. Vite no ve los cambios hechos por fuera

**El problema.** Si editas un archivo con un script externo, el watcher de Vite
puede **no detectarlo**. El archivo en disco está bien, pero el dev server sigue
sirviendo el módulo viejo.

Síntoma: la pantalla sale con datos viejos, y en la consola aparece

```
SyntaxError: The requested module '/src/.../useX.js?t=1790604159631'
does not provide an export named 'LO_QUE_ACABAS_DE_ANADIR'
```

**Cómo se diagnostica** (no adivinar): se pide el módulo al dev server y se mira
qué devuelve.

```powershell
$r = Invoke-WebRequest "http://localhost:5173/src/ruta/al/modulo.jsx" -UseBasicParsing
$r.Content -match 'lo-que-buscas'   # False = Vite sirve la version vieja
```

**El arreglo barato** (funciona):

```powershell
(Get-Item $archivo).LastWriteTime = Get-Date
```

**El arreglo de verdad:** reiniciar `npm run dev`. Si vas a editar mucho con
scripts, toca los archivos o reinicia de vez en cuando.

---

## 5. Fast Refresh tira tu medición

React vuelve a renderizar en mitad de lo que estás midiendo. Un
`querySelectorAll(...).length` puede devolver 0 no porque falte el elemento,
sino porque la app se está remontando.

**La regla.** Después de un cambio, **vuelve a consultar**. No confíes en un
resultado que obtuviste antes del cambio. Y si un elemento "desaparece",
recarga la página antes de culpar al código.

---

## 6. `document.fonts.size` valió más que mil inspecciones

El web **nunca había renderizado en Inter ni Poppins**. `index.css` las declaraba
en `--sans` y `--heading`, pero el `@import` de Google Fonts estaba mal:

```css
@import url('https://googleapis.com');   /* mal: responde 404 con HTML */
```

Un `@import` de algo que no es CSS lo descarta el navegador **sin avisar**, y el
texto cae al fallback del sistema. Nadie se dio cuenta porque se veía "normal".

**La comprobación que lo destapó**, y que sirve para cualquier fuente:

```js
document.fonts.size          // 0 = no hay ninguna @font-face cargada
document.fonts.check('16px Inter')
```

Ojo: `document.fonts.check()` devuelve `true` aunque no haya ninguna fuente
cargada, porque consulta si **se usaría**. El que miente si no reviso es
`document.fonts.size`.

**La lesson general:** un valor por defecto en CSS es un **fallo silencioso**.
Si declaras una fuente y no verificas que cargó, estás leyendo lo que quieres
ver, no lo que hay.

---

## 7. Una variable CSS no puede previsualizar otro tema

Quería mostrar en el selector de temas una miniatura con los colores de **cada**
tema, mientras el tema activo es otro.

No se puede con `var(--bg)`: las variables resuelven al tema **activo**, así que
todas las miniaturas salían iguales.

**La regla.** Para previsualizar otro tema hay que usar **valores literales**,
copiados del `index.css` de ese tema. Y documentarlo, porque parece un descuido
y no lo es.

---

## 8. No inventes datos, ni para que "quede bien"

Inventé `customer_name: "Nicolas Rivera"` en unas reservas. El usuario real se
llamaba **Nicole Dayana Ramirez Vargas**. Nadie lo notó hasta que audité los
nombres contra `users`.

Peor: lo metí como campo duplicado dentro de cada reserva, así que **podía
desincronizarse** del usuario.

**La regla.** Si un dato sale de otro sitio, no lo escribas: **resuélvelo en el
sitio donde se lee**, con un JOIN. Así no puede desincronizarse.

```js
const customer = users.find((u) => u.id === rental.customer_id);
customer_name: customer ? `${customer.first_name} ${customer.last_name}` : null
```

**Y antes de inventar un id, mira si algo ya lo referencia.** Las notificaciones
ya apuntaban a las reservas 101, 102, 105 y 108. Usar esos ids hizo que las
referencias dejaran de estar colgadas.

---

## 9. Un comentario desactualizado es peor que uno de más

Dejé escrito que la pantalla de notificaciones sobrescribía el header del Stack.
Cuando quité ese `Stack.Screen`, **el comentario se quedó mintiendo**.

Igual quité comentarios que hablaban de la conversación ("porque se decidió
enfocarse en la vista del admin"). Esos tampoco le sirven a nadie dentro de seis
meses.

**Qué se queda y qué se va:**

| Se queda | Se va |
|---|---|
| Por qué el código es así | "lo pidió el usuario" |
| Qué bug Avoidaba | "en la corrida anterior falló" |
| Qué semidió y por qué importa | "como acordamos" |
| La regla del proyecto | nombres de personas |

Un comentario que **miente** es peor que no tener comentario: el que lo lea va a
tomar una decisión equivocada con toda la confianza.

---

## 10. Antes de "arreglar", comprueba que está roto

Dos veces perdí tiempo arreglando cosas que no estaban rotas:

**El botón "Editar" del perfil.** Me dijeron que lo había eliminado. Antes de
"restaurarlo" busqué:

```powershell
git grep "modoEdicion" HEAD -- web/Front-end/src
# -> solo Traductions/Language/*.json, ningún .jsx
```

**Nunca existió.** Eran traducciones huérfanas de una función que se quitó del
código sin borrar sus claves. Y el API tampoco tenía dónde guardar: faltaba el
endpoint entero. Si lo hubiera "restaurado" tal cual, el botón no habría hecho
nada.

**El enlace del menú.** Antes de tocarlo, comparé **todos** los enlaces con
**todas** las rutas declaradas:

```js
const rutas = new Set([...app.matchAll(/<Route\s+path="([^"]+)"/g)].map(m => m[1]));
// -> 16 enlaces, 0 rotos
```

Un barrido de 30 segundos evitó dejar otro enlace muerto escondido.

---

## 11. Reglas de CSS que rompen cosas sin avisar

Tres que aparecieron:

**`.buttonBack.overlay { position: absolute; left: 2; top: 1; }`**
`left: 2` **sin unidad** es CSS inválido: el navegador lo descarta. El botón
quedaba absoluto sin desplazamiento y se montaba encima de otro elemento.
Medido: el botón en `x=76` y el texto en `x=76`, superpuestos.

**`.header-page button { background: transparent !important; }`**
Al mover un grupo de botones **dentro** de `.header-page`, les cayó una regla
que ya existía y nunca les había afectado. Perdieron su fondo. Los 4 botones
salieron `rgba(0,0,0,0)`.

**`.theme-card { display: flex; align-items: center; gap: 12px; }`**
Al meter una miniatura dentro, en **fila** el item toma el ancho de su contenido
(14px) en vez de estirarse. Se veía de 20px de ancho en un hueco de 168px.

**La regla.** Cuando algo se ve mal, **mide la geometría real** antes de
suponer:

```js
const r = el.getBoundingClientRect();
const c = getComputedStyle(el);
({ x: Math.round(r.left), y: Math.round(r.top),
   w: Math.round(r.width), position: c.position, display: c.display })
```

Con números se ve al instante que `position: static` ignora `top: 40px`, o que
dos elementos comparten `x` y por eso se pisan.

---

## 12. Las cadenas de lodash se rompen en silencio

Dentro de una cadena, `.reverse()` (alias de `_.reverseArray`) devuelve un
**array plano**, no un wrapper. Encadenar `.find().value()` detrás da `undefined`
y la respuesta llega vacía, sin error.

```js
// MAL: position llegaba {} en la respuesta
db.get('gps').find({ vehicle_id }).sortBy('recorded_at').reverse().find().value()

// BIEN: sin ambigüedad
const position = positions
    .filter((p) => p.vehicle_id === rental.vehicle_id)
    .sort(byNewestFirst)[0];
```

**La regla.** Si consultas datos, usa **arrays de JavaScript**, no cadenas.
Dan el mismo resultado y no dependen de qué métodos devuelvan un wrapper.

---

## 13. Un mock que miente sobre su estado

El módulo de ubicación seIBA a presentar como "posiciones en vivo", pero el
dispositivo GPS está `connected: false`: **no hay señal**, las posiciones son
sembradas a mano.

Sin avisar, la pantalla daba a entender que había datos en vivo cuando los
últimos datos eran de hace horas. Para evitarlo:

1. El backend expone el estado real del tracker.
2. La interfaz avisa cuando `connected` es `false`.

```jsx
{!signalLive && (
    <p className="vl-offline">
        {t("deviceOffline", { model: selected.device?.model })}
    </p>
)}
```

**La regla general.** Si una pantalla promete algo en vivo, tiene que poder
decir **cuándo no lo está**. Si no, es una promesa falsa.

---

## 14. Verifica el impacto antes de reportar

Antes de decir "listo", comprueba las tres cosas:

1. **Que funciona** — en el navegador, con los números medidos.
2. **Que no rompí nada** — consola sin errores, rutas que siguen ahí, las demás
   pantallas cargan.
3. **Que no dejé datos sucios** — `db.json` como estaba, sesiones de prueba
   fuera.

Este último es el que más veces se me olvidó. `db.json` es un archivo **compartido
con tu compañero**: dejar 20 sesiones de prueba o un teléfono cambiado ahí es
justo el daño que había que evitar.

```js
// Restaurar al final de las pruebas
db.sessions = head.sessions.map((s) => ({ ...s }));
for (const o of head.users) {
    const u = db.users.find((x) => x.email === o.email);
    if (u) u.last_login = o.last_login;   // last_login es runtime, inevitable
}
```

---

## 15. No adivines: el dato falso más caro es el que parece verdad

Unos lados de este trabajo salieron bien porque se comprobó:

- ¿La ruta existe? → `git show HEAD:` del archivo, no memoria.
- ¿Cuántos tokens coinciden? → comparación token a token, no "debería coincidir".
- ¿Quién usa este mock? → grep del import real.
- ¿Lo usa el backend o el front? → grep de las llamadas HTTP.

Y lo que salió mal, salió mal **por no comprobar**:

| Sin comprobar | Consecuencia |
|---|---|
| "El botón de editar estaba antes" | Iba a "restaurar" algo que nunca existió |
| "Los tokens coinciden 92/92" | No era reproducible; el número real era otro |
| "Los datos del GPS son reales" | Eran inventados y no lo decía la interfaz |
