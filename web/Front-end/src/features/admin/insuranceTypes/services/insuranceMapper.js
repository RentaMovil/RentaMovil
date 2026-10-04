// Respuesta de booking (camelCase) -> forma que usan los view models (snake_case)
export function fromApiInsurancePlan(plan) {
    return {
        id: plan.id,
        name: plan.name,
        coverage_details: plan.coverageDetails,
        daily_cost: Number(plan.dailyCost) || 0,
        // Solo viene cuando se pidieron los planes con startDate y endDate
        total_cost: plan.totalCost == null ? null : Number(plan.totalCost),
    };
}

export function toCreateInsurancePayload(formData) {
    return {
        name: formData.name,
        coverageDetails: formData.description,
        dailyCost: Number(formData.price),
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
