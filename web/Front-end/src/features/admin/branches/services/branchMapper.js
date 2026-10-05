// Traduce entre la sucursal de fleet-maintenance y el modelo que usan las pantallas.
// fleet: operatingHours = [{ dayOfWeek: 1..7, opensAt: "08:00", closesAt: "18:00", closed }]
// front: schedule       = [{ id: "mon".."sun", open: "08:00", close: "18:00", closed }]
const DAY_IDS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

// La columna es DECIMAL(9,6): más decimales que eso no aportan nada en un mapa
function roundCoordinate(value) {
    return Number.isFinite(value) ? Math.round(value * 1e6) / 1e6 : null;
}

export function toBranchPayload(formData) {
    return {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        // Las dos o ninguna (Branch.INV-001): el mapa siempre devuelve ambas
        latitude: roundCoordinate(formData.latitude),
        longitude: roundCoordinate(formData.longitude),
        operatingHours: formData.schedule.map((day) => ({
            dayOfWeek: DAY_IDS.indexOf(day.id) + 1,
            closed: Boolean(day.closed),
            // Un día cerrado no lleva horas
            ...(day.closed ? {} : { opensAt: day.open, closesAt: day.close }),
        })),
    };
}

export function toBranchViewModel(branch) {
    const schedule = [...(branch.operatingHours || [])]
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
        .map((hour) => ({
            id: DAY_IDS[hour.dayOfWeek - 1],
            open: hour.opensAt ?? "00:00",
            close: hour.closesAt ?? "00:00",
            closed: Boolean(hour.closed),
        }));

    return {
        id: branch.id,
        name: branch.name,
        city: branch.city,
        phone: branch.phone,
        address: branch.address,
        // fleet las manda como número (o null si la sucursal no tiene ubicación)
        latitude: branch.latitude == null ? null : Number(branch.latitude),
        longitude: branch.longitude == null ? null : Number(branch.longitude),
        schedule,
    };
}
