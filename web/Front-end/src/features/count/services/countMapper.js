export function toProfileViewModel(user) {
    return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        username: user.username,
        role: user.role,
        image: user.photo ?? null, 
    };
}

export function toUpdateProfilePayload(formData) {
    return {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        username: formData.username,
        photo: formData.image ?? null,
    };
}