import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { GenericInputInterface } from '../../../auth/models/GenericInputInterface';

@Component({
  selector: 'lib-generic-input',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatIconModule, MatButtonModule],
  templateUrl: './generic-input.html',
  styleUrl: './generic-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenericInput),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GenericInput),
      multi: true
    }
  ]
})
export class GenericInput implements ControlValueAccessor, Validator, OnInit {
  @Input() config!: GenericInputInterface;
  @Input() formControl!: FormControl;

  internalControl: FormControl = new FormControl('');
  showPassword = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  ngOnInit(): void {
    const validators = [];

    if (this.config.customValidators?.length) {
      validators.push(...this.config.customValidators);
    }

    this.internalControl.setValidators(validators);
    this.internalControl.updateValueAndValidity();

    if (this.config.disabled) {
      this.internalControl.disable();
    }

    // Sync value from internal to external
    this.internalControl.valueChanges.subscribe(val => {
      this.onChange(val);
      if (this.formControl && this.formControl.value !== val) {
        this.formControl.setValue(val, { emitEvent: false });
      }
    });

    if (this.formControl) {
      // Initial sync
      this.internalControl.setValue(this.formControl.value, { emitEvent: false });

      // Sync external control to internal
      this.formControl.valueChanges.subscribe(val => {
        if (this.internalControl.value !== val) {
          this.internalControl.setValue(val, { emitEvent: false });
        }
      });

      // ✅ Sync touched and dirty state
      this.formControl.statusChanges.subscribe(() => {
        if (this.formControl.touched) this.internalControl.markAsTouched();
        if (this.formControl.dirty) this.internalControl.markAsDirty();
      });
    }
  }


  writeValue(value: any): void {
    this.internalControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.internalControl.disable() : this.internalControl.enable();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.internalControl.errors;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  get errorMessage(): string | null {
    const control = this.formControl || this.internalControl;

    if (!control || !(control.touched || control.dirty) || !control.errors) return null;

    const errors = control.errors;
    const messages = this.config.customErrorMessages || {};

    if (errors['required']) return messages['required'] || `${this.config.label} is required`;
    if (errors['email']) return messages['email'] || 'Enter a valid email';
    if (errors['minlength']) return messages['minlength'] || `Minimum length is ${errors['minlength'].requiredLength}`;
    if (errors['maxlength']) return messages['maxlength'] || `Maximum length is ${errors['maxlength'].requiredLength}`;
    if (errors['pattern']) return messages['pattern'] || `Invalid format`;

    const customKeys = Object.keys(errors).filter(
      key => !['required', 'minlength', 'maxlength', 'pattern', 'email'].includes(key)
    );

    for (const key of customKeys) {
      if (messages[key]) return messages[key];
    }

    return 'Invalid input';
  }


  get isPassword(): boolean {
    return this.config.type === 'password';
  }

  get showRequiredStar(): boolean {
    const control = this.formControl || this.internalControl;

    const hasRequired =
      control?.validator?.({} as AbstractControl)?.['required'] ?? false;

    return !!this.config.showRequiredStar && hasRequired;
  }


}
