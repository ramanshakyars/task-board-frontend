import type { NavigateFunction } from "react-router-dom";
import PathConfig from "../config/PathConfig";
import { Role } from "../enums/Roles";
import type { LoginRequest, LoginResponse, User } from "../interfaces/AuthInterfaces";
import HttpService from "./HttpService";
import StorageService from "./StorageService";

class AuthService {

  async login(data: LoginRequest): Promise<User> {
    const response = await HttpService.post<LoginResponse>(PathConfig.login, data);

    // backend sends role directly, but we normalise just in case
    const user: User = {
      ...response.user,
      role: response.user.role === Role.ADMIN ? Role.ADMIN : Role.USER,
    };

    StorageService.setAccessToken(response.access);
    StorageService.setRefreshToken(response.refresh);
    StorageService.setUser(user);

    return user;
  }

  async logout(navigate?: NavigateFunction): Promise<void> {
    const refresh = StorageService.getRefreshToken();

    try {
      if (refresh) {
        await HttpService.post(PathConfig.logout, { refresh });
      }
    } catch {
      // even if blacklsit fails, we still clear local storage
    } finally {
      StorageService.clear();
      if (navigate) {
        navigate("/login");
      }
    }
  }

  async fetchCurrentUser(): Promise<User> {
    const user = await HttpService.get<User>(PathConfig.me);
    StorageService.setUser(user);
    return user;
  }

  getLoggedInUser(): User | null {
    return StorageService.getUser();
  }

  isLoggedIn(): boolean {
    return StorageService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.getLoggedInUser()?.role === Role.ADMIN;
  }
}

export default new AuthService();