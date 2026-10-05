// Códigos de estado de fleet-maintenance (VehicleMaintenance). "Eliminar" no existe: se cancela.
export const MAINTENANCE_STATUS = {
    SCHEDULED: 'SCHEDULED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
};

// Llave i18n de cada estado (secciones FleetChartMaintenance / CartVehiculeMaintenance)
export const MAINTENANCE_STATUS_KEY = {
    SCHEDULED: 'pending',
    IN_PROGRESS: 'inProgress',
    COMPLETED: 'completed',
    CANCELLED: 'cancel',
};

// Completado y cancelado son de solo lectura (VehicleMaintenance.INV-003)
export function isClosedMaintenance(status) {
    return status === MAINTENANCE_STATUS.COMPLETED || status === MAINTENANCE_STATUS.CANCELLED;
}
