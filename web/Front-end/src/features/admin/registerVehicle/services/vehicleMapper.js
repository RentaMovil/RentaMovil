import { VEHICLE_STATUS } from '../constans/vehicleStatus';

export function toVehiclePayload(formData) {
    return {
        // Sin "id": lo asigna el servidor como entero, igual que booking.vehicle_id.
        // La placa es un dato del vehículo, no su identificador.
        plate: formData.plate,
        brand: formData.brand,
        model: formData.model,
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        year: Number(formData.age),        
        capacity: Number(formData.capacity),
        vehicleType: formData.vehicleType,
        fuelType: formData.fuelType,
        branchId: Number(formData.branchId),
        image: formData.image,
        status: 'Disponible',              
    };
}export function toCreatePayload(formData) {
    return {
        // Sin "id": lo asigna el servidor como entero, igual que booking.vehicle_id
        plate: formData.plate.toUpperCase(),
        brand: formData.brand,
        model: formData.model,
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        year: Number(formData.age),
        capacity: Number(formData.capacity),
        vehicleType: formData.vehicleType,
        fuelType: formData.fuelType,
        branchId: Number(formData.branchId),      // antes: location: formData.location
        image: formData.image,
        status: VEHICLE_STATUS.AVAILABLE,
    };
}

export function toUpdatePayload(formData) {
    return {
        plate: formData.plate,
        brand: formData.brand,
        model: formData.model,
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        year: Number(formData.age),
        capacity: Number(formData.capacity),
        vehicleType: formData.vehicleType,
        fuelType: formData.fuelType,
        branchId: Number(formData.branchId),
        image: formData.image,
    };
}