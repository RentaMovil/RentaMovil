export function toUserViewModel(user) {
    return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        status: user.status,
        registeredAt: user.registeredAt || null,
    };
}

export function toUpdateRolePayload(role) {
    return { role };
}