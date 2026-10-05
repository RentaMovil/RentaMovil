import React, { useState } from 'react';
import "./RegisterForm.css";
import Quotes from '../../../shared/components/Quotes';
import { useTranslation } from 'react-i18next'; 


function RegisterForm({ onSubmit, onSwitchToLogin }) {
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Un solo toggle para contraseña y su confirmación: es el mismo valor.
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !phone || !username || !email || !password || !confirmPassword) {
      return setError(t('register.errorFields'));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError(t('register.emailInvalid'));
    }

    // El backend acepta dígitos, espacios y "+" (hasta 20 caracteres).
    if (!/^[0-9+ ]{7,20}$/.test(phone)) {
      return setError(t('register.phoneInvalid'));
    }

    // RegisterRequest exige 8+ caracteres, una mayúscula y un número.
    if (password.length < 8) {
      return setError(t('register.passwordShort'));
    }

    if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
      return setError(t('register.passwordWeak'));
    }

    if (password !== confirmPassword) {
      return setError(t('register.passwordMatch'));
    }

    setLoading(true);

    try {
      await onSubmit({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        username,
        password
      });
    } catch (err) {
      setError(err.message || t('register.errorCreate'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <section className="register">

      <form className="register-form" onSubmit={handleSubmit}>

        {/* Nombre */}
        <div className="form-group">
          <label>{t('register.firstName')}</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={t('register.firstNamePlaceholder')}
            required
          />
        </div>

        {/* Apellido */}
        <div className="form-group">
          <label>{t('register.lastName')}</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={t('register.lastNamePlaceholder')}
            required
          />
        </div>

        {/* Teléfono */}
        <div className="form-group">
          <label>{t('register.phone')}</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t('register.phonePlaceholder')}
            required
          />
        </div>

        {/* Usuario */}
        <div className="form-group">
          <label>{t('register.username')}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t('register.usernamePlaceholder')}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group full">
          <label>{t('register.email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('register.emailPlaceholder')}
            required
          />
        </div>

        {/* Contraseña */}
        <div className="form-group full">
          <label>{t('register.password')}</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('register.passwordPlaceholder')}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={t(showPassword ? 'loginForm.hidePassword' : 'loginForm.showPassword')}
              title={t(showPassword ? 'loginForm.hidePassword' : 'loginForm.showPassword')}
            >
              <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
            </button>
          </div>
        </div>

        {/* Confirmar contraseña */}
        <div className="form-group full">
          <label>{t('register.confirmPassword')}</label>
          {/* Comparte el toggle: es la misma contraseña que se está confirmando */}
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('register.passwordPlaceholder')}
              required
            />
          </div>
        </div>

        {/* Error */}
        {error && <div className="register-error">{error}</div>}

        {/* Link */}
        <button type="button" className="register-link" onClick={onSwitchToLogin}>
          {t('register.haveAccount')}
        </button>
        
        <button className="register-btn" type="submit" disabled={loading}>
          {loading ? t('register.submitting') : t('register.submit')}
        </button>

      </form>
    </section>
    <div>
    <Quotes />
    </div>
      </>
    
  );
}

export default RegisterForm;