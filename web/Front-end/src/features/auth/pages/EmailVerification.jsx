import style from "./EmailVerification.module.css";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineDashboard } from 'react-icons/ai';
import NavbarTwo from "../../../shared/components/layout/NavbarTwo";
import Footer from '../../../shared/components/layout/Footer';
import { useForm } from 'react-hook-form';
import { authService } from '../services/authService';


function EmailVerification({ email }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const initialEmail = email || location.state?.email || '';
    const { register, formState: { errors }, handleSubmit, reset } = useForm();
    const [sendError, setSendError] = useState('');

    // iam responde 202 exista o no el correo (no revela qué correos están registrados)
    async function insert(data) {
        setSendError('');
        try {
            await authService.forgotPassword(data.email);
            reset();
            navigate('/CodeVerification', { state: { email: data.email } });
        } catch (err) {
            // ej. 429 si se pidieron demasiados códigos
            setSendError(err.message || 'No se pudo enviar el código');
        }
    }

    return (
        <>
            <NavbarTwo />

            <div className={style["container-email"]}>
                <form className={style['email-form']} onSubmit={handleSubmit(insert)}>
                    <label htmlFor="">Ingrese su correo electrónico</label>
                    <input
                        className={style["input-email"]}
                        id="email"
                        type="email"
                        defaultValue={initialEmail}
                        autoComplete='username'
                        placeholder={t('loginForm.emailPlaceholder')}
                        {...register("email", {
                            required: "El correo electrónico es necesario",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Formato de correo electrónico es inválido"

                            }
                        })} />
                    {errors.email && (
                        <p className={style['error-message']}>
                            <AiOutlineDashboard /> {errors.email.message}
                        </p>
                    )}

                    {sendError && (
                        <p className={style['error-message']}>
                            <AiOutlineDashboard /> {sendError}
                        </p>
                    )}

                    <button type="submit">Confirmar</button>
                </form >
            </div >
            <Footer />

        </>
    );

}
export default EmailVerification;