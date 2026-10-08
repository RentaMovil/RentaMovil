import style from "./VehicleCard.module.css";
import { VEHICLE_STATUS_LABEL } from "../../registerVehicle/constans/vehicleStatus";

// Clase de color del punto según el estado de fleet
const STATE_CLASS = {
    AVAILABLE: 'disponible',
    RENTED: 'en-uso',
    MAINTENANCE: 'reservado',
};

function VehicleCard({ vehicles, selectedVehicle, onSelect, emptyMessage }) {

    return (
        <>
            
            <div className={style['vehicle-list']}>
                {vehicles.length > 0 ? (
                    vehicles.map((vehicle, index) => (
                        <button
                            key={`${vehicle.id}-${vehicle.plate}-${index}`}
                            type="button"
                            className={`${style['vehicle-card']} ${selectedVehicle?.id === vehicle.id ? style['vehicle-card--active'] : ''}`}
                            onClick={() => onSelect(vehicle)}
                        >
                            <div className={style['vehicle-card-top']}>
                                <strong>{vehicle.plate}</strong>
                                <span className={`${style['vehicle-state']} ${style[STATE_CLASS[vehicle.status]] ?? ''}`}>
                                    <span className={style['state-dot']} />
                                    {VEHICLE_STATUS_LABEL[vehicle.status] ?? vehicle.status}
                                </span>
                            </div>
                            <img src={vehicle.image} alt={vehicle.modelName} />
                            <p>{vehicle.modelName}</p>
                            <small>{vehicle.brandName} • {vehicle.year}</small>
                        </button>
                    ))
                ) : (
                    <p className={style['vehicle-empty']}>{emptyMessage}</p>
                )}
            </div>
        </>
    )
}
export default VehicleCard;