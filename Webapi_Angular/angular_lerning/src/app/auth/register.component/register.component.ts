import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TogglePassword } from '../../directives/toggle-password';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-register.component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    TogglePassword,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required, Validators.minLength(5)],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/
          ),
        ],
      ],
      roleId: [1, Validators.required],
    });
  }

  register() {
    if (this.registerForm.invalid) return;

    const formData = this.registerForm.value;

    // this.auth.register(formData).subscribe({
    //   next: (res) => {
    //     if (res.status) {
    //       this.toaster.success(res.message);
    //       this.router.navigate(['/login']);
    //     } else {
    //       this.toaster.error(res.message);
    //     }
    //   },
    //   error: () => {
    //     this.error = 'Registration failed.';
    //   },
    // });

    this.auth.register(formData).pipe(
      map((res) => {
        if (res.status) {
          this.toaster.success(res.message);
          this.router.navigate(['/login']);
        } else {
          this.toaster.error(res.message);
        }
      }),
      catchError(() => {
        this.error = 'Registration failed.';
        return of(null);
      })
    )
    .subscribe();
  }

  get passwordErrors(): string[] {
    const control = this.registerForm.get('password');
    if (!control || !control.errors) return [];

    const errors: string[] = [];

    if (control.errors['required']) errors.push('Password is required.');
    if (control.errors['minlength'])
      errors.push('Minimum 8 characters required.');
    if (control.errors['pattern']) {
      errors.push(
        'Must include lowercase, uppercase, number, and special character.'
      );
    }

    return errors;
  }
}
