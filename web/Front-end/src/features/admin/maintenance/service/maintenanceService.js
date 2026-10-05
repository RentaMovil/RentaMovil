import { httpClient } from '../../../../shared/api/httpClient';
import { MAINTENANCE_STATUS } from '../constans/maintenanceStatus';

// Mantenimientos en fleet-maintenance. No es un CRUD propio: un mantenimiento se abre al pasar
// el vehículo a MAINTENANCE y se cierra con /maintenance/complete. Aquí se traduce lo que pide
// la pantalla a esos endpoints.

const STATUS_FROM_API = {
    SCHEDULED: MAINTENANCE_STATUS.PENDING,
    IN_PROGRESS: MAINTENANCE_STATUS.IN_PROGRESS,
    COMPLETED: MAINTENANCE_STATUS.COMPLETED,
};

// GET /maintenances -> forma que usan el historial y sus gráficas
function fromApiMaintenance(record) {
    const [brand, ...model] = String(record.vehicleName ?? '').split(' ');
    return {
        id: record.id,
        vehicleId: record.vehicleId,
        plate: record.plate,
        brand,
        model: model.join(' '),
        maintenanceType: record.maintenanceType?.name ?? '',
        maintenanceTypeId: record.maintenanceType?.id,
        date: record.startDate,
        endDate: record.endDate,
        cost: record.cost == null ? 0 : Number(record.cost),
        status: STATUS_FROM_API[record.status] ?? record.status,
        observations: '',
    };
}

async function maintenanceTypeIdByName(name) {
    const types = await maintenanceService.getTypes();
    const wanted = String(name ?? '').trim().toLowerCase();
    const found = types.find((type) => type.name.toLowerCase() === wanted);
    if (!found) {
        throw new Error(`Tipo de mantenimiento no válido. Opciones: ${types.map((type) => type.name).join(', ')}`);
    }
    return found.id;
}

const notSupported = (action) => Promise.reject(new Error(`Fleet no permite ${action} un mantenimiento`));

export const maintenanceService = {
    getAll: async () => (await httpClient.get('/maintenances')).map(fromApiMaintenance),

    // Catálogo para el selector del formulario
    getTypes: () => httpClient.get('/maintenance-types'),

    // Abre el mantenimiento: el vehículo pasa a MAINTENANCE con el tipo elegido
    create: async (formData) => {
        const maintenanceTypeId = await maintenanceTypeIdByName(formData.maintenanceType);
        await httpClient.patch(`/vehicles/${formData.vehicleId}/status`, { status: 'MAINTENANCE', maintenanceTypeId });
    },

    // Solo se puede cerrar (COMPLETADO), con su costo. El vehículo vuelve a AVAILABLE
    update: async (id, formData) => {
        if (formData.status !== MAINTENANCE_STATUS.COMPLETED) {
            return notSupported('editar');
        }
        const cost = formData.cost ?? formData.price;
        await httpClient.post(`/vehicles/${formData.vehicleId}/maintenance/complete`,
            cost == null || cost === '' ? null : { cost: Number(cost) });
    },

    // El historial no se borra
    remove: () => notSupported('eliminar'),
};
