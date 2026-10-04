    import React, { useState } from "react";
    import Quotes from "../../../shared/components/Quotes.jsx";
    import "./LoginForm.css";
    import { useTranslation } from "react-i18next";
    import "./RegisterForm.jsx";
    import { useNavigate } from "react-router-dom";

    // "90 segundos" -> "2 minutos": el rate limit del login es de 5 minutos
    function formatWait(seconds) {
    if (!seconds) return "unos minutos";
    if (seconds < 60) return `${seconds} s`;
    return `${Math.ceil(seconds / 60)} min`;
    }

    // Mensaje según lo que respondió el backend:
    // 401 = datos incorrectos, 423 = cuenta bloqueada (5 intentos fallidos en iam),
    // 429 = demasiados intentos desde esta red (rate limit del gateway), 503 = servicio caído
    function loginErrorFor(err) {
    switch (err?.status) {
        case 401: return "loginForm.invalidCredentials";
        case 423: return "loginForm.accountBlocked";
        case 429: return { key: "loginForm.tooManyAttempts", params: { time: formatWait(err.retryAfter) } };
        case 503:
        case 504: return "loginForm.serviceUnavailable";
        default: return "loginForm.errorAuthentication";
    }
    }

    function LoginForm({ onSubmit, onSwitchToRegister }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
        return setError("loginForm.errorFields");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        return setError("loginForm.emailInvalid");
        }

        setLoading(true);

        try {
        await onSubmit({ email, password });
        } catch (err) {
        setError(loginErrorFor(err));
        } finally {
        setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigate("/EmailVerification", { state: { email } });
    };

    return (
        <section className="login">
        <form
            className="login-form"
            onSubmit={handleSubmit}
            aria-live="polite"
        >
            <div className="form-group">
            <label htmlFor="email">{t("loginForm.email")}</label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                placeholder={t("loginForm.emailPlaceholder")}
                required
            />
            </div>

            <div className="form-group">
            <label htmlFor="password">{t("loginForm.password")}</label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder={t("loginForm.passwordPlaceholder")}
                required
            />
            </div>

            {error && (
            <div className="login-error" role="alert">
                {typeof error === "string" ? t(error) : t(error.key, error.params)}
            </div>
            )}

            <button
            type="button"
            className="register-link"
            onClick={onSwitchToRegister}
            >
            {t("loginForm.noAccount")}
            </button>

            <button
            type="button"
            className="register-link"
            onClick={handleForgotPassword}
            >
            {t("loginForm.forgotPassword")}
            </button>

            <button
            className="email-btn"
            type="submit"
            disabled={loading}
            >
            {loading
                ? t("loginForm.submitting")
                : t("loginForm.submit")}
            </button>
        </form>

        <Quotes />
        </section>
    );
    }

    export default LoginForm;