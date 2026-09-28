/**
 * Imagenes locales de la app.
 *
 * Se centralizan aqui para que la decision de "que foto se muestra" viva en
 * un solo sitio, igual que `env.ts` centraliza la URL de la API.
 *
 * `VEHICLE_IMAGE` sustituye por ahora a `Vehicle.image` de la API. Motivo:
 * el unico vehiculo de `db.json` trae una captura de pantalla de escritorio
 * de 1.12 MB en lugar de una foto, asi que el cliente movil no puede
 * mostrar nada util.
 *
 * Cuando la API sirva una foto real por vehiculo, se borra este archivo y
 * los componentes vuelven a `source={{ uri: vehicle.image }}`.
 *
 * OJO: `require` tiene que ser un literal estatico. Metro no resuelve rutas
 * dinamicas, por eso la imagen se importa aqui y no se construye con
 * template strings.
 */
export const VEHICLE_IMAGE = require("@/assets/images/car1.jpg");
