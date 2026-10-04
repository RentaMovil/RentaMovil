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

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // El teléfono es opcional
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      return setError(t('register.errorFields'));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError(t('register.emailInvalid'));
    }

    if (phone && !/^[0-9]{10}$/.test(phone)) {
      return setError(t('register.phoneInvalid'));
    }

    if (password.length < 6) {
      return setError(t('register.passwordShort'));
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('register.passwordPlaceholder')}
            required
          />
        </div>

        {/* Confirmar contraseña */}
        <div className="form-group full">
          <label>{t('register.confirmPassword')}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('register.passwordPlaceholder')}
            required
          />
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