// UserSummary de iam (GET /users): campos en camelCase
export function toUserViewModel(user) {
    return {
        id: user.id,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        username: user.username ?? "",
        role: user.role,
        status: user.status,
        imageUrl: user.imageUrl ?? null,
    };
}

export function toUpdateRolePayload(role) {
    return { role };
}

// Solo ACTIVE o INACTIVE: a BLOCKED se llega solo (5 intentos fallidos)
export function toUpdateStatusPayload(status) {
    return { status };
}
