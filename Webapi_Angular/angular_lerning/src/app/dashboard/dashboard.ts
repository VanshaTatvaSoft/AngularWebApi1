import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '../shared/services/jwt-service';
import { GenericInput } from '../shared/components/generic-input/generic-input';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericInputInterface } from '../auth/models/GenericInputInterface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, GenericInput, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  userName: string | null;
  form: FormGroup;
  constructor(private auth: AuthService, private jwt: JwtService, private fb: FormBuilder){
    this.userName = this.jwt.getUserName();
    this.auth.setUserName(this.userName);

    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }
  ngOnDestroy(): void {
    console.log('Component destroyed');
  }

  emailConfig: GenericInputInterface = {
    appearance: 'outline',
    type: 'password',
    placeholder: 'Enter your email',
    id: 'email',
    name: 'email',
    label: 'Email',
    icon: 'email',
    customValidators: [Validators.required, Validators.email],
    customErrorMessages: {
      required: 'Email is required',
      email: 'Please enter a valid email address'
    }
  };

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }
}
