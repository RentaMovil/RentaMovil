import { useEffect, useState } from 'react';
import { fleetCatalogService } from '../../../../shared/services/fleetCatalogService';

// Tipos de mantenimiento del catálogo de fleet-maintenance (antes era texto libre)
export function useMaintenanceTypes() {
    const [maintenanceTypes, setMaintenanceTypes] = useState([]);

    useEffect(() => {
        fleetCatalogService.getMaintenanceTypes()
            .then(setMaintenanceTypes)
            .catch((err) => console.error('Error al cargar los tipos de mantenimiento:', err));
    }, []);

    return { maintenanceTypes };
}
