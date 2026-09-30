import { httpClient } from "../../../shared/api/httpClient";

const RESOURCE = '/vehicles'


export const carsService = {
    getAll: () => httpClient.get(RESOURCE),
    getById: (id) => httpClient.get(`${RESOURCE}/${id}`),
}