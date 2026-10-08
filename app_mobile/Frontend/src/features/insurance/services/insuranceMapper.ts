import type { InsuranceType } from "../../../types";

export function toInsuranceViewModel(insurance: any): InsuranceType {
    return {
        id: String(insurance.id),
        name: insurance.name,
        description: insurance.coverage_details,
        price: Number(insurance.daily_cost) || 0,
        tag: insurance.tag ?? "",
    };
}