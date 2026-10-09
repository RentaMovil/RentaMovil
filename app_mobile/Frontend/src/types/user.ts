import type { ISODateTime, UUID } from "./common";

/**
 * Entity: User (Identity & Access).
 *
 * Forma real de rtm-iam: camelCase (firstName/lastName), no snake_case
 * (eso era del mock). `login`/`register` devuelven UserResponse (sin
 * `phone`); solo `GET /users/me` (ProfileResponse) lo trae, por eso aqui es
 * opcional — se completa llamando `refreshUser()` despues de iniciar
 * sesion. No existe `last_login` en ningun DTO real: se quito.
 */
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  status: string;
  /** Solo viene en ProfileResponse (GET /users/me), no en login/register. */
  phone?: string;
  imageUrl?: string | null;
  permissions?: string[];
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
