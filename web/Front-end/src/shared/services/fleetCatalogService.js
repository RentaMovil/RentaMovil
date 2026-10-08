import { httpClient } from '../api/httpClient';

// Catálogos de referencia de fleet-maintenance (públicos, sin sesión).
// Cada modelo ya trae su marca, categoría y tipo de motor: el formulario de vehículos elige un
// modelo en vez de escribir marca + tipo + combustible a mano.
export const fleetCatalogService = {
    getBrands: () => httpClient.get('/brands'),
    getCategories: () => httpClient.get('/categories'),
    getEngineTypes: () => httpClient.get('/engine-types'),
    getVehicleModels: () => httpClient.get('/vehicle-models'),
    getMaintenanceTypes: () => httpClient.get('/maintenance-types'),
};
