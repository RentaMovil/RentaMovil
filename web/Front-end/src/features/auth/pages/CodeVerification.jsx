import React, { useRef, useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import NavbarTwo from '../../../shared/components/layout/NavbarTwo';
import Footer from '../../../shared/components/layout/Footer';
import style from "../../auth/pages/CodeVerification.module.css";

function CodeVerification() {
    const location = useLocation();
    const email = location.state?.email;
    const CODE_LENGTH = 6;
    const [code, setCode] = useState(new Array(CODE_LENGTH).fill(''));
    const inputsRef = useRef([]);
    const navigate = useNavigate();

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
        if (joined.length !== CODE_LENGTH || code.some((c) => c === '')) return;

        // iam no tiene un endpoint para verificar el código solo: se valida junto con la
        // nueva contraseña en POST /auth/password/reset (si está mal, el error sale allá)
        navigate('/ChangePasswordLogin', { state: { email, code: joined } });
    };

    return (
        <>
            <NavbarTwo />
            <div className={style["container-code"]}>
                <label>Ingrese el código enviado a su correo electrónico:
                </label>
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

                    <div className={style["confirm-button"]}>
                        <button type="submit">Verificar</button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default CodeVerification;