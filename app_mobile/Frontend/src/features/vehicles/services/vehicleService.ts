import { API_ROUTES } from "../../../config/env";
import { httpClient } from "../../../shared/api/httpClient";

import type { Vehicle, VehicleFilters } from "../../../types";

/**
 * Servicio de vehiculos contra la API mock.
 *
 * A diferencia del resto, esta entidad SI existe en `db.json`, asi que se
 * consume por HTTP real contra `/vehicles` en vez de un mock local.
 *
 * `json-server` no soporta filtros en el servidor, asi que el filtrado se
 * hace del lado del cliente sobre el conjunto completo, que es el mismo
 * criterio que usa el web (`carsService.js` deriva sus listas con
 * `new Set(cars.map(...))` sobre el catalogo completo).
 */

function matchesSearch(vehicle: Vehicle, query: string): boolean {
  const q = query.toLowerCase();

  return (
    vehicle.plate.toLowerCase().includes(q) ||
    vehicle.brand.toLowerCase().includes(q) ||
    vehicle.model.toLowerCase().includes(q) ||
    vehicle.vehicleType.toLowerCase().includes(q) ||
    vehicle.location.toLowerCase().includes(q)
  );
}

function applyFilters(
  vehicles: Vehicle[],
  filters?: VehicleFilters,
): Vehicle[] {
  if (!filters) {
    return vehicles;
  }

  return vehicles.filter((vehicle) => {
    if (filters.brand && vehicle.brand !== filters.brand) return false;
    if (filters.model && vehicle.model !== filters.model) return false;
    if (filters.vehicleType && vehicle.vehicleType !== filters.vehicleType)
      return false;
    if (filters.fuelType && vehicle.fuelType !== filters.fuelType) return false;
    if (filters.location && vehicle.location !== filters.location) return false;
    if (filters.minPrice !== undefined && vehicle.price < filters.minPrice)
      return false;
    if (filters.maxPrice !== undefined && vehicle.price > filters.maxPrice)
      return false;
    if (filters.minCapacity !== undefined && vehicle.capacity < filters.minCapacity)
      return false;
    if (filters.minYear !== undefined && vehicle.year < filters.minYear)
      return false;
    if (filters.search && !matchesSearch(vehicle, filters.search)) return false;

    return true;
  });
}

export const vehicleService = {
  async getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
    const all = await httpClient.get<Vehicle[]>(API_ROUTES.vehicles);

    return applyFilters(all, filters);
  },

  async getVehicleById(id: string): Promise<Vehicle | undefined> {
    return httpClient.get<Vehicle>(`${API_ROUTES.vehicles}/${id}`);
  },

  /** Marcas disponibles, derivadas del catalogo completo. */
  async getBrands(): Promise<string[]> {
    const all = await httpClient.get<Vehicle[]>(API_ROUTES.vehicles);

    return [...new Set(all.map((v) => v.brand))];
  },

  /** Tipos de vehiculo disponibles. */
  async getVehicleTypes(): Promise<string[]> {
    const all = await httpClient.get<Vehicle[]>(API_ROUTES.vehicles);

    return [...new Set(all.map((v) => v.vehicleType))];
  },

  /** Tipos de combustible disponibles. */
  async getFuelTypes(): Promise<string[]> {
    const all = await httpClient.get<Vehicle[]>(API_ROUTES.vehicles);

    return [...new Set(all.map((v) => v.fuelType))];
  },

  /** Ubicaciones disponibles (la API lo llama `location`). */
  async getLocations(): Promise<string[]> {
    const all = await httpClient.get<Vehicle[]>(API_ROUTES.vehicles);

    return [...new Set(all.map((v) => v.location))];
  },

  /** Rango de precios del catalogo. */
  async getPriceRange(): Promise<{ min: number; max: number }> {
    const all = await httpClient.get<Vehicle[]>(API_ROUTES.vehicles);

    const prices = all.map((v) => v.price);

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  },
};
