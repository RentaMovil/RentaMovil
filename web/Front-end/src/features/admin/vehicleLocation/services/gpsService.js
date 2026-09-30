import { httpClient } from "../../../../shared/api/httpClient";
export const gpsService = { 
    getAll: () => httpClient.get("/gps") 
};