// Catálogo único de sucursales (src/types/branch.ts — Branch).
// Única fuente de verdad: tanto el flujo de reserva (Reservation.jsx,
// selección de sucursal de entrega/devolución) como el historial de
// reservas (HistorialReservation.jsx / HistoryReservationDetail.jsx)
// resuelven nombre/ciudad/dirección de una sucursal buscando su id acá,
// en vez de guardar copias del nombre dentro de cada reserva.
//
// NOTA: el tipo real usa "branchId", pero se deja "id" para no romper
// los consumidores existentes (branchService, CardsInfo, FilterCalendar,
// Reservation.jsx) — cambiar esa clave es un refactor aparte.
export const branches = [
  {
    id: 1,
    name: "Sucursal Bogotá Centro",
    address: "Carrera 7 #32-16",
    city: "Bogotá",
    lat: 4.6097,
    lng: -74.0817
  },
  {
    id: 2,
    name: "Sucursal El Dorado",
    address: "Calle 26 N.° 103-09",
    city: "Bogotá",
    lat: 4.7016,
    lng: -74.1469
  },
  {
    id: 3,
    name: "Sucursal Salitre",
    address: "Diagonal 23 # 69 - 55",
    city: "Bogotá",
    lat: 4.6566,
    lng: -74.1110
  },
  {
    id: "BR-01",
    name: "El Poblado",
    address: "Sede Principal Cra. 43A",
    city: "Medellín",
    lat: 6.2083,
    lng: -75.5679
  },
  {
    id: "BR-02",
    name: "Aeropuerto El Dorado",
    address: "Terminal 1 - Muelle Nacional",
    city: "Bogotá",
    lat: 4.7016,
    lng: -74.1469
  }
];

/** Busca una sucursal por id en el catálogo único. */
export const getBranchById = (id) =>
  branches.find((branch) => String(branch.id) === String(id)) || null;
