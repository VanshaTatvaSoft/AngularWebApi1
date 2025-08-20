import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '../shared/services/jwt-service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenericInputInterface } from '../auth/models/GenericInputInterface';
// import { GenericForm } from '@vanshasomani/generic-form';
// import { GenericFormInterface } from '@vanshasomani/generic-form';
// import { GenericInput } from '@vanshasomani/generic-input';
import { userFormJSON } from './user-form.json';
// import { GenericInput } from '../shared/components/generic-input/generic-input';
import { GenericForm } from '../shared/components/generic-form/generic-form';
import { GenericFormInterface } from '../auth/models/GenericFormInterface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, GenericForm],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  userName: string | null;
  formConfig: GenericFormInterface;
  constructor(private auth: AuthService, private jwt: JwtService){
    this.userName = this.jwt.getUserName();
    this.auth.setUserName(this.userName);
    this.formConfig = userFormJSON;
  }

  onFormSubmit(value: any) {
    console.log('Form Submitted:', value);
  }

  onFormCancel() {
    console.log('Form Cancelled');
  }
}
