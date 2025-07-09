import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginModel } from './models/login.model';
import { TokenResponse } from './models/token-response.model';
import { RegisterModel } from './models/register.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5131/api/UserLogin';

  constructor(private http: HttpClient, private router: Router, private toast: ToastrService) {}

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
    this.toast.success("Logout success")
    this.router.navigate(['/login']);
  }
}
