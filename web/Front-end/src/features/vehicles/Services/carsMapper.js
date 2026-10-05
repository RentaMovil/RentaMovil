// Vehículos sin foto en fleet (image_url es opcional): se muestra una genérica
import carPlaceholder from "../../../assets/carro.png";
export function toClientVehicleViewModel(vehicle, branchesById = {}) {
    return {
        id: vehicle.id,
        plate: vehicle.plate,
        brandName: vehicle.brand,
        modelName: vehicle.model,
        name: [vehicle.brand, vehicle.model].filter(Boolean).join(' '),
        categoryName: vehicle.vehicleType,
        engineTypeName: vehicle.fuelType,
        branchId: vehicle.branchId,
        branchName: branchesById[vehicle.branchId]?.name || 'Sucursal no disponible',
        capacity: vehicle.capacity,
        year: vehicle.year,
        mileage: vehicle.mileage,
        dailyPrice: Number(vehicle.price) || 0,
        status: vehicle.status,
        imageUrl: vehicle.image || carPlaceholder,
    };
}