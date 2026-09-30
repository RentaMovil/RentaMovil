import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/**
 * Iconos por defecto de Leaflet.
 *
 * Vite no resuelve las URLs que leaflet apunta por defecto (`marker-icon.png`
 * relativo al bundle), asi que hay que importarlos como modulo: es el mismo
 * apano que ya hace `features/booking/components/MapComponents.jsx`.
 */
const defaultMarkerIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

/** El vehiculo se marca con un punto del color de acento. */
const vehicleIcon = L.divIcon({
    className: "vl-vehicle-marker",
    html: '<span class="vl-vehicle-dot"></span>',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
});

/**
 * Centra el mapa en la posicion.
 *
 * Se recalcula solo cuando cambia la coordenada: como el mapa se refresca cada
 * pocos segundos, `flyTo` en cada respuesta moveria el mapa mientras el usuario
 * lo esta usando.
 */
function MapCenter({ position, moved }) {
    const map = useMap();

    useEffect(() => {
        if (!position) return;
        map.flyTo([position.latitude, position.longitude], 14, { duration: 0.6 });
        // `moved` cambia solo cuando el usuario elige otro vehiculo: es lo que
        // distingue "centrate porque yo lo pedi" de "centrate porque llego una
        // posicion nueva".
    }, [map, moved]);

    return null;
}

/**
 * Mapa de telemetria: una unica marca, la posicion que acaba de reportar el GPS.
 *
 * No dibuja la ruta recorrida a proposito: el recorrido pertenece al historial
 * de rutas, que es otro apartado. Aqui solo importa donde esta el vehiculo.
 *
 * @param {object}  position Posicion actual del vehiculo.
 * @param {string}  label    Nombre del vehiculo para el popup.
 * @param {string}  detail   Texto secundario del popup.
 * @param {string}  moved    Identificador que cambia al cambiar de vehiculo.
 */
export default function VehicleMap({ position, label, detail, moved }) {
    const center = position ? [position.latitude, position.longitude] : [4.6097, -74.0817];

    return (
        <MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
            <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {position && (
                <Marker position={center} icon={vehicleIcon} zIndexOffset={1000}>
                    <Popup>
                        <strong>{label}</strong>
                        <br />
                        {detail}
                    </Popup>
                </Marker>
            )}

            <MapCenter position={position} moved={moved} />
        </MapContainer>
    );
}
