import { httpClient } from "../../../../shared/api/httpClient";
// Dispositivos GPS registrados en telemetry-gps (no posiciones: eso sale de /tracking/**)
export const gpsService = {
    getAll: () => httpClient.get("/gps")
};