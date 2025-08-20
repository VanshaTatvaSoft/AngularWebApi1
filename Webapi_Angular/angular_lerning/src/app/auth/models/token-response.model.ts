export interface TokenResponse {
  status: boolean;
  message: string;
  accessToken: string | null;
  refreshToken: string | null;
  fingerPrint: string | null;
  userName: string
}