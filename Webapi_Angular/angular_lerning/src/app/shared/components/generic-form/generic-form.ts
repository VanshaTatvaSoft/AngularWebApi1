import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenericFormInterface } from '../../../auth/models/GenericFormInterface';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GenericInput } from '../generic-input/generic-input';

@Component({
  selector: 'app-generic-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatInputModule, MatButtonModule, MatFormFieldModule, GenericInput],
  templateUrl: './generic-form.html',
  styleUrl: './generic-form.css'
})
export class GenericForm implements OnInit{
  @Input() config!: GenericFormInterface;
  @Output() submitted = new EventEmitter<any>()
  @Output() cancelled = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const group: any = {};

    for (const field of this.config.fields){
      const validators = [];

      if (field.customValidators?.length) {
        validators.push(...field.customValidators);
      }

      let initialValue: any = field.value ?? '';

      if (field.type === 'checkbox') initialValue = false;
      if (field.type === 'radio') initialValue = null;
      field.customValidators = [];

      group[field.name] = [{ value: initialValue , disabled: field.disabled ?? false }, validators];

      this.form = this.fb.group(group);
    }

    console.log("Genric form - ",this.form);
  }

  onSubmit() {
    if (this.form.valid) {
      this.submitted.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancelled.emit(true);
  }

  getControl<T = any>(name: string): FormControl<T> {
    return this.form.get(name) as FormControl<T>;
  }
}
