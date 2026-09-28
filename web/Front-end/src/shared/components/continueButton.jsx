    import React from "react";

    /**
     * ContinueButton Component (Versión Web)
     * @param {string} title - Texto que se muestra dentro del botón.
     * @param {Function} onPress - Función que se ejecuta al hacer clic.
     * @param {boolean} disabled - Bandera para bloquear las interacciones.
     * @param {Object} style - Estilos en línea opcionales para sobreescribir márgenes, etc.
     */
    export default function ContinueButton({
    title,
    onPress,
    disabled = false,
    style = {}
    }) {
    return (
        <button
        type="button"
        disabled={disabled}
        onClick={onPress}
        aria-disabled={disabled}
        style={{
            backgroundColor: disabled ? "var(--accent)" : "var(--button)",
            color: disabled ? "var(--text-h)" : "var(--text-button)",
            padding: "14px 24px",
            borderRadius: "8px",
            border: "none",
            fontSize: "16px",
            fontWeight: "700",
            letterSpacing: "0.5px",
            cursor: disabled ? "not-allowed" : "pointer",
            width: "calc(100% - 32px)",
            display: "block",
            margin: "15px 16px",
            textAlign: "center",
            transition: "background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease",
            boxShadow: disabled ? "none" : "0px 2px 4px rgba(0, 0, 0, 0.1)",
            ...style
        }}
        onMouseEnter={(e) => {
            if (!disabled) e.currentTarget.style.backgroundColor = "var(--button-hover)";
        }}
        onMouseLeave={(e) => {
            if (!disabled) e.currentTarget.style.backgroundColor = "var(--button)";
        }}
        onMouseDown={(e) => {
            if (!disabled) e.currentTarget.style.transform = "scale(0.98)";
        }}
        onMouseUp={(e) => {
            if (!disabled) e.currentTarget.style.transform = "scale(1)";
        }}
        >
        {title}
        </button>
    );
    }
