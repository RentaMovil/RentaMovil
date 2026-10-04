import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../auth/services/authService";
import { useAuth } from "../../../contexts/AuthContext";
import { useDialog } from "../../../shared/components/dialog/dialogContext";
import { isPasswordValid } from "../utils/passWorrdValidation.js";
import {
    buildPasswordRules,
    getConfirmPasswordClassName,
    getCurrentPasswordClassName,
    getPasswordClassName,
} from "../utils/changePasswordUtils.js";

function useChangePassword(t) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { alert } = useDialog();
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const passwordsMatch = password === confirmPassword;
    const isValid = isPasswordValid(password) && passwordsMatch && currentPassword.length > 0;
    const rules = buildPasswordRules(password, t);

    const getCurrentPasswordClass = () => getCurrentPasswordClassName(currentPassword);
    const getPasswordClass = () => getPasswordClassName(password, isPasswordValid(password));
    const getConfirmClass = () => getConfirmPasswordClassName(confirmPassword, passwordsMatch);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await authService.changePassword(currentPassword, password);
            await alert({ message: t("changePassword.successPassword"), tone: "success" });
            // iam ya cerró todas las sesiones (también esta): se limpia lo local y se vuelve al login
            await logout();
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message || t("changePassword.errorRequest"));
        } finally {
            setLoading(false);
        }
    };

    return {
        currentPassword, setCurrentPassword,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        showPassword, setShowPassword,
        showConfirm, setShowConfirm,
        loading, error, passwordsMatch, isValid, rules,
        getCurrentPasswordClass, getPasswordClass, getConfirmClass,
        handleChangePassword,
    };
}

export default useChangePassword;