import AuthService from "../services/AuthService";

export function isAdmin(): boolean {
  return AuthService.isAdmin();
}
