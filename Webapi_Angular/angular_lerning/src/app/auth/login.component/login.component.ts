import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login.component',
  standalone: true,
  imports: [CommonModule, FormsModule , RouterModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userEmail = "";
  password = "";
  error = "";

  constructor(private auth: AuthService, private router: Router){ }

  login(loginForm: NgForm) {
    this.auth.login({ useremail: this.userEmail, password: this.password })
      .subscribe({
        next: (res) => {
          if (res.status) {
            localStorage.setItem('access_token', res.accessToken!);
            localStorage.setItem('refresh_token', res.refreshToken!);
            this.router.navigate(['/dashboard']);
            loginForm.resetForm();
          } else {
            this.error = res.message;
          }
        },
        error: () => {
          this.error = 'Login failed. Check credentials.';
        }
      });
  }

}
