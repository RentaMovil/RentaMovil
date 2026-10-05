import { createContext, useContext } from "react";

export const DialogContext = createContext(null);

// Reemplaza window.alert / window.confirm con un modal con el estilo de la app.
//   const { alert, confirm } = useDialog();
//   await alert("Contraseña cambiada");
//   if (await confirm({ message: "¿Seguro?", danger: true })) { ... }
export function useDialog() {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog debe utilizarse dentro de DialogProvider");
    }
    return context;
}
