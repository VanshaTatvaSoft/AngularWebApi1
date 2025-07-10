import { Injectable } from '@angular/core';
import { Storage } from './storage';
import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
  iss: string;
  aud: string;
}

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(private storage: Storage) {}

  getAccessToken(): string | null {
    return this.storage.getItem('access_token');
  }

  getUserRole(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    const decoded = jwtDecode<JwtPayload>(token);
    return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
  }

  getUserName(): string {
    const token = this.getAccessToken();
    if (!token) return "";

    const decoded = jwtDecode<JwtPayload>(token);
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  }

  isRole(expectedRole: string): boolean {
    return this.getUserRole() === expectedRole;
  }

}
