import { VEHICLE_STATUS_LABEL, LABEL_TO_VEHICLE_STATUS } from '../../registerVehicle/constans/vehicleStatus';
export function toStatusViewModel(vehicle) {
    return {
        id: vehicle.id,
        plate: vehicle.plate,
        brandName: vehicle.brand,
        modelName: vehicle.model,
        status: VEHICLE_STATUS_LABEL[vehicle.status] || vehicle.status,
        branchName: vehicle.location,
        description: vehicle.description || '',
        imageUrl: vehicle.image || null,
        mileage: vehicle.mileage,
        age: vehicle.year,
        dailyPrice: vehicle.price,
        engineTypeName: vehicle.fuelType,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType,
    };
}

export function toUpdateStatusPayload(formData) {
    return {
        brand: formData.brandName,
        model: formData.model,
        plate: formData.plate,
        status: LABEL_TO_VEHICLE_STATUS[formData.state] || formData.state,
        location: formData.branchName,
        description: formData.description || '',
        image: formData.image || '',
        mileage: Number(formData.mileage),
        year: Number(formData.age),
        price: Number(formData.price),
        fuelType: formData.fuelType,
        capacity: Number(formData.capacity),
        vehicleType: formData.vehicleType,
    };
}