import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

/**
 * Reexporta el hook del contexto para no obligar a los consumidores a
 * importar desde `context/` (que es detalle de implementacion).
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return context;
}
