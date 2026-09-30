import type { ISODateTime, UUID } from "./common";

/**
 * Entity: User (Identity & Access).
 * Fuente: `web/Front-end/db.json` (coleccion `users`) y `mock-server.cjs`.
 *
 * IMPORTANTE — convencion de la API: `users` es la unica coleccion en
 * snake_case (`first_name`, `last_login`). `vehicles` es camelCase. La app
 * replica los nombres tal cual llegan en vez de "corregirlos", para que la
 * traza de red sea 1:1 con la API y no haya sorpresas al migrar.
 *
 * `password_hash` nunca se recibe: `mock-server.cjs` lo elimina con
 * `toPublicUser()` antes de responder.
 */
export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string;
  role: string;
  status: string;
  last_login: ISODateTime | null;
};

/** Entity: Session. */
export type Session = {
  id: UUID;
  user_id: string;
  refresh_token: string;
  created_at: ISODateTime;
  expires_at: ISODateTime;
  ip_address: string | null;
  user_agent: string | null;
  revoked: boolean;
};

/** Entity: VerificationCode. */
export type VerificationCode = {
  id: UUID;
  user_id: string;
  code: string;
  type: string;
  used: boolean;
  created_at: ISODateTime;
  expires_at: ISODateTime;
};

/** Payload de `POST /auth/login`. */
export type LoginRequest = {
  email: string;
  password: string;
};

/** Payload de `POST /auth/register`. */
export type RegisterRequest = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
};

/** Reset de contrasena: `POST /auth/reset-password`. */
export type ResetPasswordRequest = {
  email: string;
  newPassword: string;
};

/** Cambio de contrasena estando autenticado: `PATCH /auth/me/password`. */
export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

/** Verificacion de codigo: `POST /auth/verify-code`. */
export type VerifyCodeRequest = {
  email: string;
  code: string;
};

/**
 * Respuesta de `POST /auth/login` y `POST /auth/register`.
 *
 * `expiresIn` viene en **segundos** (900 = 15 min).
 */
export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

/** Respuesta completa de login y registro. */
export type AuthResponse = AuthTokens & {
  user: User;
};

/** Respuesta de `POST /auth/refresh`: no renueva el refresh token. */
export type RefreshResponse = {
  accessToken: string;
  expiresIn: number;
};
