export interface TokenResponse {
  status: boolean;
  message: string;
  accessToken: string | null;
  refreshToken: string | null;
  userName: string
}