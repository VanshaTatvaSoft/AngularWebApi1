import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel } from './models/login.model';
import { TokenResponse } from './models/token-response.model';
import { RegisterModel } from './models/register.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Storage } from '../shared/services/storage';
import { BehaviorSubject } from 'rxjs';
import { JwtService } from '../shared/services/jwt-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private apiUrl = 'http://localhost:5131/api/UserLogin';
  private apiUrl = `${environment.apiBaseUrl}/UserLogin`;
  
  private userNameSubject = new BehaviorSubject<string>('');
  private userRoleSubject = new BehaviorSubject<string>('');
  userName$ = this.userNameSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService,
    private storage: Storage,
    private jwtService: JwtService
  ) {}

  setUserName(name: string) {
    this.userNameSubject.next(name);
  }

  setUserRole(role: string) {
    this.userRoleSubject.next(role);
  }

  getUserName(): string {
    return this.userNameSubject.getValue();
  }

  getUserRole(): string {
    return this.userRoleSubject.getValue();
  }

  login(data: LoginModel) {
    const formData = new FormData();
    formData.append('userEmail', data.useremail);
    formData.append('password', data.password);
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, formData);
  }

  register(data: RegisterModel) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    return this.http.post<TokenResponse>(`${this.apiUrl}/register`, formData);
  }

  refreshToken(refreshToken: string) {
    const formData = new FormData();
    formData.append('refreshToken', refreshToken);
    return this.http.post<TokenResponse>(`${this.apiUrl}/refresh`, formData);
  }

  logout() {
    localStorage.clear();
    this.toast.success('Logout success');
    this.router.navigate(['/login']);
  }

  AccessDenied() {
    this.router.navigate(['/AccessDenied']);
  }

  getAccessToken(): string | null {
    return this.storage.getItem('access_token');
  }

  handlePostLoginRedirect() {
    let role = this.jwtService.getUserRole();
    this.userRoleSubject.next(role || '');
    if (role === 'Admin') {
      this.router.navigate(['/dashboard']);
    } else if (role === 'Client') {
      this.router.navigate(['/signal']);
    } else {
      this.router.navigate(['/AccessDenied']);
    }
  }

}
