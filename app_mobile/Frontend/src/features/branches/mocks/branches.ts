import type { Branch } from "../../../types";

/**
 * Catalogo de sucursales.
 *
 * NO esta en la API mock, asi que se resuelve localmente. Los datos son
 * los del frontend web (`web/Front-end/src/shared/mocks/branches.js`) para
 * que mobile y web muestren las mismas sucursales.
 *
 * NOTA: los ids del web son heterogeneos ("1", "2", "BR-01"). Aqui se
 * normalizan a string, que es como los trata el dominio (UUID).
 */
export const branches: Branch[] = [
  {
    id: "1",
    name: "Sucursal Bogotá Centro",
    address: "Carrera 7 #32-16",
    city: "Bogotá",
    lat: 4.6097,
    lng: -74.0817,
  },
  {
    id: "2",
    name: "Sucursal El Dorado",
    address: "Calle 26 N.° 103-09",
    city: "Bogotá",
    lat: 4.7016,
    lng: -74.1469,
  },
  {
    id: "3",
    name: "Sucursal Salitre",
    address: "Diagonal 23 # 69 - 55",
    city: "Bogotá",
    lat: 4.6566,
    lng: -74.111,
  },
  {
    id: "BR-01",
    name: "El Poblado",
    address: "Sede Principal Cra. 43A",
    city: "Medellín",
    lat: 6.2083,
    lng: -75.5679,
  },
  {
    id: "BR-02",
    name: "Aeropuerto El Dorado",
    address: "Terminal 1 - Muelle Nacional",
    city: "Bogotá",
    lat: 4.7016,
    lng: -74.1469,
  },
];
