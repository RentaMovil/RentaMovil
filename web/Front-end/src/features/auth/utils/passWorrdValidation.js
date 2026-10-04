    // iam exige mínimo 8, una mayúscula y un número; el carácter especial lo pide el frontend
    export const isPasswordValid = (pass) => {
        return pass.length >= 8 &&
            /[A-Z]/.test(pass) &&
            /\d/.test(pass) &&
            /[#@!$%^&*.-]/.test(pass);
    };
