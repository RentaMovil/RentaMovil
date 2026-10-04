import "./Account.css";
import { useState, useEffect } from "react";
import login from "../../../assets/login.png";
import { FaEdit, FaMoon, FaGlobe, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import Navbar from "../../../shared/components/layout/Navbar";
import Footer from "../../../shared/components/layout/Footer";
import { Link, useNavigate } from "react-router-dom";
import ButtonBack from "../../../shared/components/buttonBack";
import { useTranslation } from "react-i18next";
import espanish from "../../../assets/img/espana.png";
import english from "../../../assets/img/eeuu.png";
import french from "../../../assets/img/francia2.png";
import portuguese from "../../../assets/img/portugal.png";
import { useCount } from "../hooks/useCount";
import { useUpdateCount } from "../hooks/useUpdateCount";
import { useImageUpload } from "../../../shared/hooks/useImageUpload";
// falta DELETE — ver nota sobre modal de borrado en la conversación previa

function Account({ theme, setTheme }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { profile, isLoading, error, refetch } = useCount();
  const { updateCount, isLoading: isSaving } = useUpdateCount();
  const { uploadImage, isUploading } = useImageUpload();

  // Borrador local que el usuario edita antes de guardar; se resincroniza cada vez que llega el perfil real
  const [draft, setDraft] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (profile) setDraft(profile);
  }, [profile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setPendingFile(file);
  };

  const handleSave = async () => {
    setSaveError(null);
    try {
      let image = draft.image;
      if (pendingFile) {
        image = await uploadImage(pendingFile);
      }
      await updateCount({ ...draft, image });
      await refetch();
      setPendingFile(null);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message || "No se pudo guardar el perfil.");
    }
  };

  const handleLangChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setShowLangModal(false);
  };

  const hasPendingChanges =
    draft && profile ? JSON.stringify(draft) !== JSON.stringify(profile) : false;

  const getStatusText = () => {
    if (isEditing) {
      return hasPendingChanges ? t("account.modoEdicion") : t("account.perfilActualizado");
    }
    return t("account.perfilActualizado");
  };

  if (isLoading || !draft) {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center", padding: "2rem" }}>Cargando perfil...</p>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <p style={{ textAlign: "center", padding: "2rem", color: "red" }}>{error}</p>
        <Footer />
      </>
    );
  }

  const previewImage = pendingFile ? URL.createObjectURL(pendingFile) : draft.image || login;

  return (
    <>
      <Navbar />
      <div className="containerC">
        <div className="cardC">
          <div className="header-page">
            <ButtonBack onClick={() => navigate(-1)} />
            <p className={`status2 ${isEditing && hasPendingChanges ? "pending" : ""}`}>
              {getStatusText()}
            </p>
          </div>
          <div className="actions">
            <button
              className="icon-btnC"
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={isSaving || isUploading}
            >
              {isEditing ? <FaSave /> : <FaEdit />}
            </button>

            <button className="icon-btnC" onClick={() => setShowThemeModal(true)}>
              <FaMoon />
            </button>

            <button className="icon-btnC" onClick={() => setShowLangModal(true)}>
              <FaGlobe />
            </button>
          </div>

          <div className="formC">
            <div className="form-image">
              <label>
                <img className="imgPerfile" src={previewImage} alt="preview" />
                <p className={`edit ${isEditing ? "editingText" : ""}`}>
                  {t("account.cambiarFoto")}
                </p>
                {isEditing && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                )}
              </label>
            </div>

            <div className="form-groupC">
              <label className="form-labelC">{t("account.nombre")}:</label>
              <input
                className={`inputC ${isEditing ? "editing" : ""}`}
                type="text"
                value={draft.firstName || ""}
                onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-groupC">
              <label className="form-labelC">Apellido:</label>
              <input
                className={`inputC ${isEditing ? "editing" : ""}`}
                type="text"
                value={draft.lastName || ""}
                onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-groupC">
              <label className="form-labelC">Usuario:</label>
              <input
                className={`inputC ${isEditing ? "editing" : ""}`}
                type="text"
                value={draft.username || ""}
                onChange={(e) => setDraft({ ...draft, username: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-groupC">
              <label className="form-labelC">{t("account.telefono")}:</label>
              <input
                className={`inputC ${isEditing ? "editing" : ""}`}
                type="text"
                value={draft.phone || ""}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-groupC">
              <label className="form-labelC">{t("account.correo")}:</label>
              <input className="inputC" type="email" value={draft.email || ""} readOnly />
              <div className="accountLink">
                <Link to="/ChangeEmail" className="linkC">
                  {t("account.modificarCorreo")}
                </Link>
              </div>
            </div>

            <div className="form-groupC">
              <label className="form-labelC">{t("account.password")}:</label>
              <input className="inputC" type="password" value="••••••••" readOnly />
              <div className="accountLink">
                <Link to="/ChangePassword" className="linkC">
                  {t("account.modificarPassword")}
                </Link>
              </div>
            </div>

            {/* aun no implementado el apartado de eliminar las cuentas — pendiente conectar useDeleteCount */}
          </div>
        </div>

        {saveError && <p className="status2" style={{ color: "red" }}>{saveError}</p>}
      </div>

      {showThemeModal && (
        <div className="modal-overlay" onClick={() => setShowThemeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">{t("account.seleccionaTema")}</p>
            <div className="theme-grid">
              {[
                { id: "skylight", label: "Modo azul claro", desc: "Fondo blanco, texto oscuro" },
                { id: "light", label: "Modo Verde claro", desc: "Fondo blanco, acentos amarillos" },
                { id: "dark", label: "Azul Oscuro", desc: "Fondo azul noche, acentos navy" },
                { id: "darkPurple", label: "Verde Oscuro", desc: "Fondo verde oscuro, acentos claros" },
              ].map(({ id, label, desc }) => (
                <button
                  key={id}
                  type="button"
                  className={`theme-card ${theme === id ? "active2" : ""}`}
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
                {t("account.cancelar")}
              </button>
              <button className="btn-times" onClick={() => setShowThemeModal(false)}>
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      )}

      {showLangModal && (
        <div className="modal-overlay" onClick={() => setShowLangModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">{t("account.seleccionaIdioma")}</p>
            <div className="theme-grid">
              {[
                { id: "es", label: "Español", flag: espanish, desc: "Spanish" },
                { id: "en", label: "English", flag: english, desc: "Inglés" },
                { id: "fr", label: "Français", flag: french, desc: "Francés" },
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
                {t("account.cancelar")}
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

export default Account;