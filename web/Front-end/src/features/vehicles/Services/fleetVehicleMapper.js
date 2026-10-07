import { httpClient } from "../../../shared/api/httpClient";
import { VEHICLE_STATUS } from "../../admin/registerVehicle/constans/vehicleStatus";

// Puente entre fleet-maintenance y las pantallas, que se hicieron sobre el mock (marca y modelo
// como texto, price, image, location...). En vez de reescribir cada pantalla, los servicios pasan
// todo por aquí: fleet -> forma plana que ya leen los mappers de cada feature, y al revés.

// Estados de fleet -> los valores que usan los <select> y las etiquetas del frontend
const STATUS_FROM_API = {
    AVAILABLE: VEHICLE_STATUS.AVAILABLE,
    RENTED: VEHICLE_STATUS.RENTED,
    MAINTENANCE: VEHICLE_STATUS.MAINTENANCE,
    RETIRED: "Retirado",
};

export function fromApiVehicle(vehicle) {
    const model = vehicle.model ?? {};
    return {
        id: vehicle.id,
        plate: vehicle.plate,
        modelId: model.id,
        brand: model.brand?.name ?? "",
        model: model.name ?? "",
        vehicleType: model.category?.name ?? "",
        fuelType: model.engineType?.name ?? "",
        capacity: vehicle.capacity,
        year: vehicle.year,
        mileage: Number(vehicle.mileage) || 0,
        price: Number(vehicle.dailyPrice) || 0,
        image: vehicle.imageUrl ?? null,
        branchId: vehicle.branch?.id ?? null,
        location: vehicle.branch?.name ?? "",
        status: STATUS_FROM_API[vehicle.status] ?? vehicle.status,
        apiStatus: vehicle.status,
    };
}

// El catálogo público viene paginado ({ items, total... }); las listas del frontend esperan un array
export const fromApiVehiclePage = (page) => (page?.items ?? []).map(fromApiVehicle);

// fleet guarda el modelo por id (vehicle_model). Los formularios siguen pidiendo marca y modelo
// como texto, así que se busca el modelo del catálogo con ese nombre y esa marca.
async function resolveModelId(brand, model) {
    const models = await httpClient.get("/vehicle-models");
    const same = (a, b) => String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
    const found = models.find((m) => same(m.name, model) && same(m.brand?.name, brand));
    if (!found) {
        throw new Error(`El modelo "${brand} ${model}" no existe en el catálogo de vehículos`);
    }
    return found.id;
}

// Cuerpo de POST/PUT /vehicles (VehicleWriteRequest). El estado no va: un vehículo nuevo siempre
// nace AVAILABLE y los cambios de estado tienen sus propios endpoints.
export async function toApiVehicleWrite(vehicle) {
    return {
        plate: String(vehicle.plate ?? "").trim().toUpperCase(),
        modelId: vehicle.modelId ?? (await resolveModelId(vehicle.brand, vehicle.model)),
        capacity: Number(vehicle.capacity),
        year: vehicle.year ? Number(vehicle.year) : null,
        dailyPrice: Number(vehicle.price),
        branchId: Number(vehicle.branchId),
        mileage: Number(vehicle.mileage) || 0,
        imageUrl: vehicle.image || null,
    };
}
