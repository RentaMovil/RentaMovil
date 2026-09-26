import { useState, useEffect } from "react";
import "./Count.css";
import login from "../../../assets/login.png";
import { FaEdit, FaMoon, FaGlobe, FaSave, FaTimes } from "react-icons/fa";
import Navbar from "../../../shared/components/layout/NavBarAdmin";
import Footer from "../../../shared/components/layout/FooterAdmin";
import { Link, useNavigate } from "react-router-dom";
import ButtonBack from "../../../shared/components/buttonBack";
import { useTranslation } from "react-i18next";
import espanish from "../../../assets/img/espana.png";
import english from "../../../assets/img/eeuu.png";
import french from "../../../assets/img/francia2.png";
import portuguese from "../../../assets/img/portugal.png";

function Count({ theme, setTheme }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
const [user, setUser] = useState(() => {
  const saved = localStorage.getItem("user");
  return saved
    ? JSON.parse(saved)
    : {
        nombre: "Sharik Rojas",
        telefono: "3145556",
        email: "sha@example.com",
        password: "123456",
      };
});

const [image, setImage] = useState(() => {
  const saved = localStorage.getItem("user");
  if (saved) {
    const parsed = JSON.parse(saved);
    return parsed.image || login;
  }
  return login;
});

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setImage(base64);
        const updatedUser = { ...user, image: base64 };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLangChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setShowLangModal(false);
  };

  return (
    <>
      <Navbar />

      <div className="containerC">
        <div className="cardC">
          <div className="header-page">
            <ButtonBack onClick={() => navigate(-1)} variant="overlay" />
          </div>
          <div className="actions">
            <button
              className="icon-btnC"
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
            >
              {isEditing ? <FaSave /> : <FaEdit />}
            </button>

            <button className="icon-btnC" onClick={() => setShowThemeModal(true)}>
              <FaMoon />
            </button>

            {/* Botón idioma ahora funcional (v2 lo tenía sin onClick) */}
            <button className="icon-btnC" onClick={() => setShowLangModal(true)}>
              <FaGlobe />
            </button>
          </div>

          <div className="formC">
            <div className="form-image">
              <label>
                <img className="imgPerfile" src={image} alt="preview" />
                <p className={`edit ${isEditing ? "editingText" : ""}`}>
                  {t("count.cambiarFoto")}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div className="form-groupC">
              <label className="form-labelC">{t("count.nombre")}:</label>
              <input
                className={`inputC ${isEditing ? "editing" : ""}`}
                type="text"
                value={user.nombre}
                onChange={(e) => setUser({ ...user, nombre: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-groupC">
              <label className="form-labelC">{t("count.telefono")}:</label>
              <input
                className={`inputC ${isEditing ? "editing" : ""}`}
                type="text"
                value={user.telefono}
                onChange={(e) => setUser({ ...user, telefono: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-groupC">
              <label className="form-labelC">{t("count.correo")}:</label>
              <input
                className={`inputC ${isEditing ? "editing" : ""}`}
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-groupC">
              <label className="form-labelC">{t("count.password")}:</label>
              <input
                className="inputC"
                type="password"
                value={user.password}
                readOnly
              />
            </div>

            <Link to="/ChangePassword" className="linkC">
              {t("count.modificarPassword")}
            </Link>
              <p className="status2">
              {isEditing ? t("count.modoEdicion") : t("count.perfilActualizado")}
            </p>
          </div>
        </div>
      </div>

      {/* ── Modal Tema ── */}
      {showThemeModal && (
        <div className="modal-overlay" onClick={() => setShowThemeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">{t("count.seleccionaTema")}</p>
            <div className="theme-grid">
              {[
                { id: "skylight", label: "Modo azul claro",     desc: "Fondo blanco, texto oscuro" },
                { id: "light",    label: "Modo Verde claro",  desc: "Fondo blanco, acentos amarillos" },
                { id: "dark",     label: "Azul Oscuro" ,                 desc: "Fondo azul noche, acentos navy" },
                { id: "darkPurple", label: "Verde Oscuro",             desc: "Fondo verde oscuro, acentos claros" },
              ].map(({ id, label, desc }) => (
                <button
                  key={id}
                  type="button"
                  className={`theme-card ${theme === id ? "active" : ""}`}
                  onClick={() => setTheme(id)}
                >
                  <div className={`theme-preview preview-${id}`}></div>
                  <div className="theme-card-info">
                    <p className="theme-name">{label}</p>
                    <p className="theme-desc">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="modal-actions">
              <button className="close-btn" onClick={() => setShowThemeModal(false)}>
                {t("count.cancelar")}
              </button>
              <button className="btn-times" onClick={() => setShowThemeModal(false)}>
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Idioma (solo existía en v1) ── */}
      {showLangModal && (
        <div className="modal-overlay" onClick={() => setShowLangModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">{t("count.seleccionaIdioma")}</p>
            <div className="theme-grid">
              {[
                { id: "es", label: "Español",   flag: espanish,   desc: "Spanish"   },
                { id: "en", label: "English",   flag: english,    desc: "Inglés"    },
                { id: "fr", label: "Français",  flag: french,     desc: "Francés"   },
                { id: "pt", label: "Português", flag: portuguese, desc: "Portugués" },
              ].map(({ id, label, flag, desc }) => (
                <button
                  key={id}
                  type="button"
                  className={`theme-card ${i18n.language === id ? "active" : ""}`}
                  onClick={() => handleLangChange(id)}
                >
                  <div className="lang-preview">
                    <img src={flag} alt={label} className="lang-flag" />
                  </div>
                  <div className="theme-card-info">
                    <p className="theme-name">{label}</p>
                    <p className="theme-desc">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="modal-actions">
              <button className="close-btn" onClick={() => setShowLangModal(false)}>
                {t("count.cancelar")}
              </button>
              <button className="btn-times" onClick={() => setShowLangModal(false)}>
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Count;