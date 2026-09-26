import { httpClient } from "../../../../shared/api/httpClient";
import { toCreateBankAccountPayload } from "./bankAccountMapper";

const RESOURCE = "/bankAccounts";

export const bankAccountService = {
    getAll: () => httpClient.get(RESOURCE),
    create: (formData) => httpClient.post(RESOURCE, toCreateBankAccountPayload(formData)),
    setActive: (id, isActive) => httpClient.patch(`${RESOURCE}/${id}`, { is_active: isActive }),
};