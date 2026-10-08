// Adaptador entre el vehículo de fleet-maintenance y el modelo interno que ya usan las pantallas
// (el mismo formato que tenía el mock: brand, model, vehicleType, fuelType, price, image...).
// Así las pantallas que solo leen vehículos no cambian; solo cambian las que escriben.
export function fromFleetVehicle(vehicle) {
    const model = vehicle.model || {};
    return {
        id: vehicle.id,
        plate: vehicle.plate,
        modelId: model.id,
        brandId: model.brand?.id,
        brand: model.brand?.name ?? '',
        model: model.name ?? '',
        // La categoría y el tipo de motor son del modelo, no de cada vehículo
        categoryId: model.category?.id,
        vehicleType: model.category?.name ?? '',
        engineTypeId: model.engineType?.id,
        fuelType: model.engineType?.name ?? '',
        branchId: vehicle.branch?.id,
        location: vehicle.branch?.name ?? '',
        price: Number(vehicle.dailyPrice) || 0,
        mileage: Number(vehicle.mileage) || 0,
        year: vehicle.year,
        capacity: vehicle.capacity,
        image: vehicle.imageUrl || null,
        // Código de fleet: AVAILABLE, RENTED, MAINTENANCE o RETIRED (ver constans/vehicleStatus.js)
        status: vehicle.status,
    };
}

// Formulario de registrar/editar -> VehicleWriteRequest de fleet-maintenance.yaml.
// El estado no va: un vehículo nace AVAILABLE y su estado cambia por sus propios caminos.
export function toFleetVehiclePayload(formData) {
    return {
        plate: formData.plate.trim().toUpperCase(),
        modelId: Number(formData.modelId),
        capacity: Number(formData.capacity),
        year: Number(formData.age),
        dailyPrice: Number(formData.price),
        branchId: Number(formData.branchId),
        mileage: Number(formData.mileage),
        imageUrl: formData.image || null,
    };
}
