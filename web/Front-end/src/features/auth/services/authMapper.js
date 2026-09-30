export function toLoginPayload({ email, password }) {
    return {
        email: email.trim().toLowerCase(),
        password,
    };
}

export function toRegisterPayload(formData) {
    return {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
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
