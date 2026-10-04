    export const getCurrentPasswordClassName = (currentPassword) => {
    if (currentPassword.length === 0) return "inputBaseP";
    return "inputBaseP inputValidP";
    };

    export const getPasswordClassName = (password, isValidPassword) => {
    if (password.length === 0) return "inputBaseP";
    return isValidPassword
        ? "inputBaseP inputValidP"
        : "inputBaseP inputInvalidP";
    };

    export const getConfirmPasswordClassName = (confirmPassword, passwordsMatch) => {
    if (confirmPassword.length === 0) return "inputBaseP";
    return passwordsMatch
        ? "inputBaseP inputValidP"
        : "inputBaseP inputInvalidP";
    };

    export const buildPasswordRules = (password, t) => [
    {
        label: t("changePassword.caracters"),
        valid: password.length >= 8,
    },
    {
        label: t("changePassword.specialCaracters"),
        valid: /[#@!$%^&*.-]/.test(password),
    },
    {
        label: t("changePassword.uppercase"),
        valid: /[A-Z]/.test(password),
    },
    {
        label: t("changePassword.number"),
        valid: /\d/.test(password),
    },
    ];
