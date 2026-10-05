import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../auth/services/authService";
import { useDialog } from "../../../shared/components/dialog/dialogContext";
import { isPasswordValid } from "../utils/passWorrdValidation.js";
import { buildPasswordRules, getConfirmPasswordClassName, getPasswordClassName } from "../utils/changePasswordUtils.js";

function useChangePasswordLogin(t) {
    const location = useLocation();
    const navigate = useNavigate();
    const { alert } = useDialog();
    const { email, code } = location.state || {};

    // Si se entra directo a la URL (sin correo ni código) se vuelve a pedir el correo
    useEffect(() => {
        if (!email || !code) navigate("/EmailVerification", { replace: true });
    }, [email, code, navigate]);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const passwordsMatch = password === confirmPassword;
    const isValid = isPasswordValid(password) && passwordsMatch;
    const rules = buildPasswordRules(password, t);

    const getPasswordClass = () => getPasswordClassName(password, isPasswordValid(password));
    const getConfirmClass = () => getConfirmPasswordClassName(confirmPassword, passwordsMatch);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await authService.resetPassword({ email, code, newPassword: password });
            await alert({ message: t("changePassword.successPassword"), tone: "success" });
            navigate('/'); // vuelve a login con la contraseña ya actualizada
        } catch (err) {
            setError(err.message || t("changePassword.errorRequest"));
        } finally {
            setLoading(false);
        }
    };

    return {
        password, setPassword, confirmPassword, setConfirmPassword,
        showPassword, setShowPassword, showConfirm, setShowConfirm,
        loading, error, passwordsMatch, isValid, rules,
        getPasswordClass, getConfirmClass, handleChangePassword,
    };
}

export default useChangePasswordLogin;