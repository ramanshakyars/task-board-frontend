import type { User } from "../interfaces/AuthInterfaces";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";
const USER_KEY = "user";

class StorageService {

  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(USER_KEY);
  }

  // kept for backword compatiblity with old code
  removeAuthData(): void {
    this.clear();
  }
}

export default new StorageService();