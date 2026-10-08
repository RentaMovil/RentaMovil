import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineLock, AiOutlineSafety, AiOutlineArrowRight } from 'react-icons/ai';
import NavbarTwo from '../../../shared/components/layout/NavbarTwo';
import Footer from '../../../shared/components/layout/Footer';
import { authService } from '../services/authService';
import style from "../../auth/pages/CodeVerification.module.css";

function CodeVerification() {
    const location = useLocation();
    const email = location.state?.email;
    const CODE_LENGTH = 6;
    const [code, setCode] = useState(new Array(CODE_LENGTH).fill(''));
    const inputsRef = useRef([]);
    const navigate = useNavigate();
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');


    // El código de iam son 6 dígitos
    const allowedChars = /^[0-9]$/;

    const handleChange = (e, index) => {
        const value = e.target.value;
        // si se borra
        if (value === '') {
            const newCode = [...code];
            newCode[index] = '';
            setCode(newCode);
            return;
        }

        // validar y tomar solo el ultimo caracter valido
        const lastChar = value.slice(-1);
        if (!allowedChars.test(lastChar)) return;

        const newCode = [...code];
        newCode[index] = lastChar.toUpperCase();
        setCode(newCode);

        // mover foco al siguiente input
        if (index < CODE_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            // si el campo actual ya está vacío, retroceder
            if (code[index] === '' && index > 0) {
                inputsRef.current[index - 1]?.focus();
                const newCode = [...code];
                newCode[index - 1] = '';
                setCode(newCode);
            } else {
                const newCode = [...code];
                newCode[index] = '';
                setCode(newCode);
            }
        }
        // permitir flechas, tab, etc. sin interferir
    };

    
const handleVerify = async (e) => {
    e.preventDefault();
    const joined = code.join('');
    if (joined.length !== CODE_LENGTH || code.some((c) => c === '')) {
        setError('Por favor completa los 6 dígitos');
        return;
    }

    setIsVerifying(true);
    setError('');

    try {
        await authService.verifyCode(email, joined);
        // Si llega aquí, el código es válido
        navigate('/ChangePasswordLogin', { state: { email, code: joined } });
    } catch (err) {
        setError('Código incorrecto o expirado. Intenta de nuevo.');
    } finally {
        setIsVerifying(false);
    }
};


    return (
        <>
            <NavbarTwo />
            
            <div className={style["page-background"]}>
                <div className={style["container-code"]}>
                    <div className={style["header-icon"]}>
                        <AiOutlineLock />
                    </div>
                    
                    <h2 className={style["title"]}>Código de Verificación</h2>
                    <p className={style["description"]}>
                        Ingrese el código de 6 dígitos enviado a<br />
                        <strong>{email}</strong>
                    </p>

                    <form onSubmit={handleVerify}>
                        <div className={style["code-inputs"]}>
                            {code.map((c, i) => (
                                <input
                                    className={style["code-input"]}
                                    key={i}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={c}
                                    onChange={(e) => handleChange(e, i)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                    ref={(el) => (inputsRef.current[i] = el)}
                                    aria-label={`code-${i + 1}`}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className={style["error-message"]}>{error}</p>
                        )}

                        <button 
                            type="submit" 
                            className={style["confirm-button"]}
                            disabled={isVerifying}
                        >
                            {isVerifying ? 'Verificando...' : 'Verificar Código'}
                            {!isVerifying && <AiOutlineArrowRight className={style["button-icon"]} />}
                        </button>

                        <div className={style["resend-link"]}>
                            ¿No recibiste el código? <button type="button" onClick={() => {}}>Reenviar</button>
                        </div>
                    </form>

                    <div className={style["security-footer"]}>
                        <div className={style["security-item"]}>
                            <AiOutlineLock />
                            <span>Código expira en 15 min</span>
                        </div>
                        <div className={style["security-item"]}>
                            <AiOutlineSafety />
                            <span>Datos Encriptados</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CodeVerification;