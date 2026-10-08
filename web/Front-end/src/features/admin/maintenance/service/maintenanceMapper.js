import { MAINTENANCE_STATUS } from '../constans/maintenanceStatus';

// Formulario de registrar -> MaintenanceCreateRequest de fleet-maintenance.yaml.
// "Iniciar ahora" crea el mantenimiento en curso (fecha de hoy, el vehículo pasa a Mantenimiento);
// si no, queda programado para la fecha elegida.
export function toCreateMaintenancePayload(formData) {
    const startNow = Boolean(formData.startNow);
    return {
        vehicleId: formData.vehicleId,
        maintenanceTypeId: Number(formData.maintenanceTypeId),
        status: startNow ? MAINTENANCE_STATUS.IN_PROGRESS : MAINTENANCE_STATUS.SCHEDULED,
        startDate: startNow ? undefined : formData.date,
        cost: Number(formData.price),
        observations: formData.observations || undefined,
        imageUrl: formData.image || undefined,
    };
}

// Formulario de editar -> MaintenanceUpdateRequest. "" borra las observaciones.
export function toUpdateMaintenancePayload(formData) {
    return {
        maintenanceTypeId: Number(formData.maintenanceTypeId),
        startDate: formData.date,
        cost: Number(formData.price),
        observations: formData.observations ?? '',
    };
}

// MaintenanceResponse -> modelo que usan el historial y las gráficas
export function toMaintenanceViewModel(record) {
    const vehicle = record.vehicle || {};
    return {
        id: record.id,
        vehicleId: vehicle.id,
        plate: vehicle.plate,
        brandName: vehicle.brand,
        modelName: vehicle.model,
        maintenanceTypeId: record.maintenanceType?.id,
        typeMaintenance: record.maintenanceType?.name ?? '',
        date: record.startDate,
        endDate: record.endDate,
        cost: record.cost,
        description: record.observations ?? '',
        image: record.imageUrl,
        status: record.status,
    };
}

// "2026-10-05" -> fecha local. new Date("2026-10-05") la toma como UTC y en Colombia muestra el día anterior.
export function formatDate(isoDate) {
    const [year, month, day] = String(isoDate).slice(0, 10).split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString();
}
