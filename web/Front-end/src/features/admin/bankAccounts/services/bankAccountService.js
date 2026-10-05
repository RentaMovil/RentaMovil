import { httpClient } from "../../../../shared/api/httpClient";
import { toCreateBankAccountPayload } from "./bankAccountMapper";

// El gateway enruta /bank-accounts/**, con guion.
const RESOURCE = "/bank-accounts";

export const bankAccountService = {
    getAll: () => httpClient.get(RESOURCE),
    create: (formData) => httpClient.post(RESOURCE, toCreateBankAccountPayload(formData)),
    setActive: (id, isActive) => httpClient.patch(`${RESOURCE}/${id}`, { is_active: isActive }),
};