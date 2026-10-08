import { httpClient } from "../../../../shared/api/httpClient";
import { toCreateBankAccountPayload } from "./bankAccountMapper";

// El gateway enruta /bank-accounts/**, con guion.
const RESOURCE = "/bank-accounts";

export const bankAccountService = {
    getAll: (includeInactive = false) =>
        httpClient.get(includeInactive ? `${RESOURCE}?includeInactive=true` : RESOURCE),
    create: (formData) => httpClient.post(RESOURCE, toCreateBankAccountPayload(formData)),
    setActive: (id, isActive) => httpClient.patch(`${RESOURCE}/${id}`, { isActive }),
};
