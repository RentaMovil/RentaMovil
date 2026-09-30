export function toCreateInsurancePayload(formData) {
    return {
        name: formData.name,
        coverage_details: formData.description,
        daily_cost: Number(formData.price),
    };
}

export function toUpdateInsurancePayload(formData) {
    return {
        name: formData.name,
        coverage_details: formData.description,
        daily_cost: Number(formData.price),
    };
}

export function toInsuranceViewModel(insurance) {
    return {
        id: insurance.id,
        name: insurance.name,
        description: insurance.coverage_details,
        price: Number(insurance.daily_cost) || 0,
    };
}