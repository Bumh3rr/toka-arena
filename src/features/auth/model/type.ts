export interface LoginData {
  success: boolean;
  isNewPlayer: boolean;
}

export interface AuthContextType {
  login: () => Promise<LoginData>;
  logout: () => void;
}
