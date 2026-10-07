import { useEffect, useState } from 'react';
import { fleetCatalogService } from '../../../../shared/services/fleetCatalogService';

// Marcas y modelos de fleet-maintenance para el formulario de vehículos. Cada modelo ya trae su
// marca, categoría y tipo de motor (ver 06-data/models.md -> vehicle_model).
export function useVehicleCatalog() {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([fleetCatalogService.getBrands(), fleetCatalogService.getVehicleModels()])
            .then(([brandsResponse, modelsResponse]) => {
                setBrands(brandsResponse);
                setModels(modelsResponse);
            })
            .catch((err) => setError(err.message || 'No se pudo cargar el catálogo de vehículos'));
    }, []);

    return { brands, models, error };
}
