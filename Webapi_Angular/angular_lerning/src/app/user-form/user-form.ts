import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserForm {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      users: this.fb.array([])
    });
  }

  get forms(): FormGroup[] {
    return this.userFormArray.controls as FormGroup[];
  }


  get userFormArray(): FormArray {
    return this.userForm.get('users') as FormArray;
  }

  getAddUserForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', Validators.required]
    });
  }

  addUserFormClick(): void {
    const userForm = this.getAddUserForm();
    this.userFormArray.push(userForm);
  }

  submitAll(): void {
    if (this.userForm.valid) {
      console.log('Submitted data:', this.userFormArray.value);
    } else {
      console.warn('Form is invalid!');
    }
  }

  deleteUserForm(index: number): void {
    if (this.userFormArray.length >= 1) {
      this.userFormArray.removeAt(index);
    } else {
      console.warn('At least one user form must remain.');
    }
  }

}
