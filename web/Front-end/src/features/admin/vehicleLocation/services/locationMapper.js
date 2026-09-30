export function toLocationViewModel(location) {
    return {
        id: location.id,
        gpsId: location.gps_id,
        latitude: location.latitude,
        longitude: location.longitude,
        recordedAt: location.timestamp,
    };
}