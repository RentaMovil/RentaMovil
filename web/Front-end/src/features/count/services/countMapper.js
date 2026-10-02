// Respuesta de GET /users/me (iam): campos en camelCase
export function toProfileViewModel(user) {
    return {
        id: user.id,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email,
        phone: user.phone ?? "",
        username: user.username,
        role: user.role,
        // iam no guarda foto de perfil todavía
        image: null,
    };
}

// PATCH /users/me solo acepta nombre, apellido y teléfono.
// El username no se puede cambiar y el email va por /users/me/email.
export function toUpdateProfilePayload(formData) {
    return {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
    };
}