import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

/**
 * Store de tokens de sesion.
 *
 * Modelo de dos niveles, en linea con `web/Front-end/src/shared/api/tokenStore.js`:
 *
 *  - El **access token** vive solo en memoria (igual que el web, donde es un
 *    `let`). Es de vida corta (15 min) y no debe sobrevivir a un cierre de app.
 *  - El **refresh token** se persiste, porque dura 7 dias.
 *
 * El refresh token intentaria guardarse en `expo-secure-store` (Keychain /
 * Keystore del sistema). Ese modulo necesita un binario nativo alineado con
 * el JS: si corres en Expo Go con un nativo mas viejo, el objeto del modulo
 * existe pero le faltan metodos, y `deleteItemAsync` revienta con
 * "deleteValueWithKeyAsync is not a function". `isAvailableAsync()` NO sirve
 * como comprobacion, porque mira `getValueWithKeyAsync`, que si existe.
 *
 * Por eso cada operacion se intenta en secure-store y, ante cualquier fallo,
 * cae a AsyncStorage y marca el nivel como no disponible para no reintentar.
 * En un entorno correctamente alineado se usa Keychain/Keystore; en uno
 * desalineado la app funciona con almacenamiento plano en vez de morir.
 *
 * Cuando exista dev build y se pueda garantizar el nativo, se puede quitar
 * el fallback dejando solo secure-store.
 */

const REFRESH_TOKEN_KEY = "rentamovil_refresh_token";

let accessToken: string | null = null;
let onRefreshFail: () => void = () => {};

/**
 * Sticky: en cuanto secure-store falla una vez, se deja de usar para el
 * resto de la sesion. Asi no se repite el error en cada llamada.
 */
let secureStoreUsable = true;

async function readRefreshToken(): Promise<string | null> {
  if (secureStoreUsable) {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch {
      secureStoreUsable = false;
    }
  }

  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

async function writeRefreshToken(token: string): Promise<void> {
  if (secureStoreUsable) {
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
      return;
    } catch {
      secureStoreUsable = false;
    }
  }

  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * Borra el refresh token de ambos niveles.
 *
 * Se intenta siempre secure-store aunque ya se sepa inutilizable, para no
 * dejar un token huerfano en el Keychain si se escribio ahi antes de que el
 * nativo fallara. Ningun error se propaga: limpiar no debe poder romper la app.
 */
async function deleteRefreshToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch {
    // secure-store inutilizable: el token vive (o vivio) en AsyncStorage.
  }

  try {
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Idem: limpiar es idempotente y su fallo no debe propagarse.
  }
}

export const tokenStore = {
  /** `true` si el refresh token se guarda en Keychain/Keystore. */
  isUsingSecureStore(): boolean {
    return secureStoreUsable;
  },

  getAccessToken(): string | null {
    return accessToken;
  },

  setAccessToken(token: string): void {
    accessToken = token;
  },

  clear(): void {
    accessToken = null;
  },

  getRefreshToken(): Promise<string | null> {
    return readRefreshToken();
  },

  setRefreshToken(token: string): Promise<void> {
    return writeRefreshToken(token);
  },

  clearRefreshToken(): Promise<void> {
    return deleteRefreshToken();
  },

  /**
   * Borra ambos tokens. Se usa en logout y cuando el refresh falla.
   * Nunca lanza: es el camino de error de la app.
   */
  async clearAll(): Promise<void> {
    accessToken = null;

    try {
      await deleteRefreshToken();
    } catch {
      // Silenciado a proposito.
    }
  },

  setOnRefreshFail(callback: () => void): void {
    onRefreshFail = callback;
  },

  triggerRefreshFail(): void {
    onRefreshFail();
  },
};
