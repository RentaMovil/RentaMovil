import { API_ROUTES } from "../../../config/env";
import { httpClient } from "../../../shared/api/httpClient";

import type {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RefreshResponse,
  RegisterRequest,
  ResetPasswordRequest,
  User,
  VerifyCodeRequest,
} from "../../../types";

/**
 * Servicio de autenticacion contra la API mock.
 *
 * Sustituye por completo la version anterior, que comparaba contra
 * `mocks/auth.ts` y devolvia un token ficticio. Ahora habla HTTP real con
 * `mock-server.cjs`, que emite JWT de 15 min + refresh token de 7 dias.
 *
 * El `users` de la API es la unica coleccion en snake_case, asi que
 * `register` envia `first_name` / `last_name` tal cual.
 */

export async function login(data: LoginRequest): Promise<AuthResponse> {
  // El server hace `email.trim().toLowerCase()`; replicarlo aqui evita que
  // un correo con mayusculas o espacios falle la busqueda.
  return httpClient.post<AuthResponse>(API_ROUTES.auth.login, {
    email: data.email.trim().toLowerCase(),
    password: data.password,
  });
}

export async function register(
  data: RegisterRequest,
): Promise<AuthResponse> {
  return httpClient.post<AuthResponse>(API_ROUTES.auth.register, {
    first_name: data.first_name.trim(),
    last_name: data.last_name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    username: data.username.trim(),
    password: data.password,
  });
}

export async function refresh(
  refreshToken: string,
): Promise<RefreshResponse> {
  return httpClient.post<RefreshResponse>(API_ROUTES.auth.refresh, {
    refreshToken,
  });
}

export async function logout(refreshToken: string): Promise<void> {
  // Responde 204. Un 404/401 aqui no debe impedir el logout local.
  await httpClient
    .post<void>(API_ROUTES.auth.logout, { refreshToken })
    .catch(() => undefined);
}

export async function getCurrentUser(): Promise<User> {
  return httpClient.get<User>(API_ROUTES.auth.me);
}

export async function forgotPassword(email: string): Promise<void> {
  await httpClient.post<void>(API_ROUTES.auth.forgotPassword, {
    email: email.trim().toLowerCase(),
  });
}

export async function verifyCode(data: VerifyCodeRequest): Promise<boolean> {
  const res = await httpClient.post<{ verified: boolean }>(
    API_ROUTES.auth.verifyCode,
    { email: data.email.trim().toLowerCase(), code: data.code.trim() },
  );

  return res.verified;
}

export async function resetPassword(
  data: ResetPasswordRequest,
): Promise<void> {
  await httpClient.post<void>(API_ROUTES.auth.resetPassword, {
    email: data.email.trim().toLowerCase(),
    newPassword: data.newPassword,
  });
}

export async function changePassword(
  data: ChangePasswordRequest,
): Promise<void> {
  await httpClient.patch<void>(API_ROUTES.auth.changePassword, data);
}
