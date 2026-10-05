// Estados de un vehículo en fleet-maintenance (02-domain/entities-and-rules.md -> Vehicle).
// Son los códigos que viajan en la API; los textos en español son solo para mostrar.
export const VEHICLE_STATUS = {
    AVAILABLE: 'AVAILABLE',
    // Rentado = en uso por un cliente (lo cambia booking-reservation con la entrega/devolución)
    RENTED: 'RENTED',
    MAINTENANCE: 'MAINTENANCE',
    // Dado de baja: nunca se elimina un vehículo, se retira (terminal)
    RETIRED: 'RETIRED',
};

export const VEHICLE_STATUS_LABEL = {
    [VEHICLE_STATUS.AVAILABLE]: 'Disponible',
    [VEHICLE_STATUS.RENTED]: 'En uso',
    [VEHICLE_STATUS.MAINTENANCE]: 'Mantenimiento',
    [VEHICLE_STATUS.RETIRED]: 'Retirado',
};
