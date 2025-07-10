import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TogglePassword } from '../../directives/toggle-password';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Storage } from '../../shared/services/storage';

@Component({
  selector: 'app-login.component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterLink,
    TogglePassword,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  userEmail = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toaster: ToastrService,
    private storageService: Storage
  ) {}

  login(loginForm: NgForm) {
    this.auth
      .login({ useremail: this.userEmail, password: this.password })
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.storageService.setItem('access_token',  res.accessToken!);
            this.storageService.setItem('refresh_token', res.refreshToken!);
            // localStorage.setItem('access_token', res.accessToken!);
            // localStorage.setItem('refresh_token', res.refreshToken!);
            this.toaster.success(res.message);
            this.router.navigate(['/dashboard']);
            loginForm.resetForm();
          } else {
            this.toaster.error(res.message);
          }
        },
        error: () => {
          this.error = 'Login failed. Check credentials.';
        },
      });
  }
}
