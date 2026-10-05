// fleet guarda el horario como 7 días numerados (1 = lunes) con opensAt/closesAt;
// la pantalla trabaja con ids "mon".."sun" y open/close en "HH:mm".
const DAY_IDS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const toHHmm = (time) => (time ? String(time).slice(0, 5) : "08:00");

function toOperatingHours(schedule = []) {
    const byId = Object.fromEntries(schedule.map((day) => [day.id, day]));
    // fleet exige los 7 días: los que la pantalla no mande quedan cerrados
    return DAY_IDS.map((id, index) => {
        const day = byId[id];
        const closed = !day || Boolean(day.closed);
        return {
            dayOfWeek: index + 1,
            opensAt: closed ? null : day.open,
            closesAt: closed ? null : day.close,
            closed,
        };
    });
}

function fromOperatingHours(operatingHours = []) {
    return [...operatingHours]
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
        .map((hour) => ({
            id: DAY_IDS[hour.dayOfWeek - 1],
            open: toHHmm(hour.opensAt),
            close: toHHmm(hour.closesAt ?? "18:00"),
            closed: Boolean(hour.closed),
        }));
}

const toCoordinate = (value) => (value === "" || value == null ? null : Number(value));

// Cuerpo de POST /branches y PUT /branches/{id} (BranchWriteRequest de fleet)
function toBranchPayload(formData) {
    return {
        name: formData.name,
        city: formData.city,
        phone: formData.phone,
        address: formData.address,
        latitude: toCoordinate(formData.latitude),
        longitude: toCoordinate(formData.longitude),
        operatingHours: toOperatingHours(formData.schedule),
    };
}

export const toCreateBranchPayload = toBranchPayload;
export const toUpdateBranchPayload = toBranchPayload;

export function toBranchViewModel(branch) {
    return {
        id: branch.id,
        name: branch.name,
        city: branch.city,
        phone: branch.phone,
        address: branch.address,
        latitude: branch.latitude ?? null,
        longitude: branch.longitude ?? null,
        schedule: branch.schedule ?? fromOperatingHours(branch.operatingHours),
    };
}
