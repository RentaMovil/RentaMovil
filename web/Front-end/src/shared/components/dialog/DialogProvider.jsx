import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertTriangle, FiCheckCircle, FiInfo } from "react-icons/fi";

import { DialogContext } from "./dialogContext";
import "./Dialog.css";

const ICONS = {
    info: FiInfo,
    success: FiCheckCircle,
    warning: FiAlertTriangle,
    danger: FiAlertTriangle,
};

export default function DialogProvider({ children }) {
    const { t } = useTranslation();
    // Un solo diálogo a la vez; resolve es la promesa que espera quien lo abrió
    const [dialog, setDialog] = useState(null);
    const acceptRef = useRef(null);

    const open = useCallback((options, isConfirm) => new Promise((resolve) => {
        const opts = typeof options === "string" ? { message: options } : options;
        setDialog({ ...opts, isConfirm, resolve });
    }), []);

    const alert = useCallback((options) => open(options, false), [open]);
    const confirm = useCallback((options) => open(options, true), [open]);

    const close = (result) => {
        dialog?.resolve(result);
        setDialog(null);
    };

    // Enter acepta, Escape cancela; el foco va al botón principal
    useEffect(() => {
        if (!dialog) return undefined;
        acceptRef.current?.focus();
        const onKey = (e) => {
            if (e.key === "Escape") close(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    const value = useMemo(() => ({ alert, confirm }), [alert, confirm]);

    const tone = dialog?.danger ? "danger" : (dialog?.tone ?? (dialog?.isConfirm ? "warning" : "info"));
    const Icon = ICONS[tone];

    return (
        <DialogContext.Provider value={value}>
            {children}

            {dialog && (
                <div className="dlg-overlay" onClick={() => close(false)}>
                    <div
                        className="dlg-box"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="dlg-title"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`dlg-icon dlg-${tone}`}>
                            <Icon />
                        </div>
                        {dialog.title && <h3 id="dlg-title" className="dlg-title">{dialog.title}</h3>}
                        <p className="dlg-message">{dialog.message}</p>

                        <div className="dlg-actions">
                            {dialog.isConfirm && (
                                <button type="button" className="dlg-btn dlg-btn-secondary" onClick={() => close(false)}>
                                    {dialog.cancelText ?? t("dialog.cancel", "Cancelar")}
                                </button>
                            )}
                            <button
                                ref={acceptRef}
                                type="button"
                                className={`dlg-btn ${tone === "danger" ? "dlg-btn-danger" : "dlg-btn-primary"}`}
                                onClick={() => close(true)}
                            >
                                {dialog.confirmText ?? t("dialog.accept", "Aceptar")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DialogContext.Provider>
    );
}
