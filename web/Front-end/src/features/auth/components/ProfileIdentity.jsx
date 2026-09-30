import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import login from "../../../assets/login.png";

const EMPTY = "—";

// Campos editables. El correo NO se incluye a proposito: cambiarlo es una
// operacion aparte (verificacion por correo) y no un guardado de perfil.
const CAMPOS = [
    { key: "firstName", etiqueta: "account.nombre", tipo: "text" },
    { key: "lastName", etiqueta: "account.apellido", tipo: "text" },
    { key: "username", etiqueta: "account.usuario", tipo: "text" },
    { key: "phone", etiqueta: "account.telefono", tipo: "tel" },
];

export default function ProfileIdentity({
    user,
    isEditing = false,
    onSave,
    isSaving = false,
    onChangeEmail,
}) {
    const { t } = useTranslation();

    // El borrador vive aqui, no en el padre, porque es el componente que tiene
    // los inputs. Se reinicia cada vez que se entra o se sale del modo edicion,
    // para no dejar cambios a medias si se cancela.
    const [borrador, setBorrador] = useState({});

    useEffect(() => {
        if (!isEditing) {
            setBorrador({});
            return;
        }
        setBorrador({
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            username: user?.username ?? "",
            phone: user?.phone ?? "",
        });
    }, [isEditing, user]);

    if (!user) {
        return null;
    }

    const valor = (key) => (isEditing ? (borrador[key] ?? "") : user[key] || EMPTY);

    const guardar = () => {
        // Solo se manda lo que cambio de verdad. Si no hay nada, se cierra el
        // modo edicion sin llamar a la API: el backend responde 400 "No hay
        // cambios validos" y al usuario le pareceria un fallo.
        const cambios = {};
        for (const c of CAMPOS) {
            const nuevo = (borrador[c.key] ?? "").trim();
            if (nuevo && nuevo !== (user[c.key] ?? "")) {
                cambios[c.key] = nuevo;
            }
        }

        onSave?.(cambios);
    };

    return (
        <>
            <div className="form-image">
                <div className="form-image-preview">
                    <img
                        className="imgPerfile"
                        src={user.imageUrl || login}
                        alt={t("account.profileImage")}
                    />
                </div>
            </div>

            {CAMPOS.map((campo) => (
                <div className="form-groupC" key={campo.key}>
                    <label className="form-labelC" htmlFor={`profile-${campo.key}`}>
                        {t(campo.etiqueta)}:
                    </label>
                    <input
                        id={`profile-${campo.key}`}
                        className="inputC"
                        type={campo.tipo}
                        value={valor(campo.key)}
                        onChange={
                            isEditing
                                ? (e) =>
                                    setBorrador((b) => ({ ...b, [campo.key]: e.target.value }))
                                : undefined
                        }
                        readOnly={!isEditing}
                    />
                </div>
            ))}

            <div className="form-groupC">
                <label className="form-labelC" htmlFor="profile-email">
                    {t("account.correo")}:
                </label>
                <input
                    id="profile-email"
                    className="inputC"
                    type="email"
                    value={user.email || EMPTY}
                    readOnly
                />

                {/* El correo no entra en el modo edicion del perfil: cambiarlo
                    es otra operacion (HU-IAM-004) que exige reintroducir la
                    contrasena actual, asi que se abre en su propio modal. */}
                <button type="button" className="linkC ce-open" onClick={onChangeEmail}>
                    {t("changeEmail.open")}
                </button>
            </div>

            <div className="form-groupC">
                <label className="form-labelC" htmlFor="profile-password">
                    {t("account.password")}:
                </label>
                <input
                    id="profile-password"
                    className="inputC"
                    type="password"
                    value="••••••"
                    readOnly
                />
                <div className="accountLink">
                    <Link to="/ChangePassword" className="linkC">
                        {t("account.modificarPassword")}
                    </Link>
                </div>
            </div>

            {/* Boton de guardar. Solo en modo edicion. */}
            {isEditing && (
                <div className="form-groupC">
                    <button
                        className="btn-saveProfile"
                        type="button"
                        onClick={guardar}
                        disabled={isSaving}
                    >
                        {isSaving ? t("account.guardando") : t("account.guardar")}
                    </button>
                </div>
            )}
        </>
    );
}
