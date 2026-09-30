
import { VEHICLE_STATUS } from "../../admin/registerVehicle/constans/vehicleStatus";
export const filterVehicles = (cars, { brand, type, category, model, price }) => {
    return cars
        .filter((car) => (!brand ? true : car.brandName === brand))
        .filter((car) => (!type ? true : car.engineTypeName === type))
        .filter((car) => (!category ? true : car.categoryName === category))
        .filter((car) => (!model ? true : car.modelName === model))
        .filter((car) =>
            price ? car.dailyPrice >= price.min && car.dailyPrice <= price.max : true
        );
};
export function filterAvailableByBranch(cars, branch) {
    console.log('branch seleccionado:', branch);
    console.log('cars disponibles:', cars.map(c => ({ id: c.id, status: c.status, branchId: c.branchId })));
    return cars.filter(
        (car) => car.status === VEHICLE_STATUS.AVAILABLE && car.branchId === branch?.id
    );
}