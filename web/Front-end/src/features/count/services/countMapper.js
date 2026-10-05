// rtm-iam devuelve y espera camelCase (firstName / lastName / imageUrl). El fallback en
// snake_case queda por si algún endpoint antiguo devolviera esa forma.
export function toProfileViewModel(user) {
    return {
        id: user.id,
        firstName: user.firstName ?? user.first_name ?? "",
        lastName: user.lastName ?? user.last_name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        username: user.username ?? "",
        role: user.role ?? "CLIENT",
        image: user.imageUrl ?? user.image_url ?? user.photo ?? null,
    };
}

// UpdateProfileRequest también es camelCase. username no se envía: no está en ese DTO.
export function toUpdateProfilePayload(formData) {
    return {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || null,
        imageUrl: formData.image ?? null,
    };
}