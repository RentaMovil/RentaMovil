// LoginRequest acepta correo O username en el campo `identifier`. Mandar `email` da 400.
export function toLoginPayload({ email, password }) {
    return {
        identifier: email.trim().toLowerCase(),
        password,
    };
}

// RegisterRequest espera camelCase; `first_name` da 400. phone es opcional.
export function toRegisterPayload(formData) {
    return {
        firstName: formData.first_name.trim(),
        lastName: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone?.trim() || null,
        username: formData.username.trim(),
        password: formData.password,
    };
}

export function toAuthUserViewModel(payload) {
    const user = payload?.user ?? payload ?? {};

    return {
        id: user.id,
        firstName: user.firstName ?? user.first_name ?? user.nombre ?? "",
        lastName: user.lastName ?? user.last_name ?? user.apellido ?? "",
        email: user.email ?? "",
        phone: user.phone ?? user.telefono ?? "",
        username: user.username ?? "",
        imageUrl: user.imageUrl ?? user.image_url ?? user.image ?? null,
        role: String(user.role ?? "CLIENT").toUpperCase(),
        status: String(user.status ?? "ACTIVE").toUpperCase(),
        lastLogin: user.lastLogin ?? user.last_login ?? null,
    };
}
