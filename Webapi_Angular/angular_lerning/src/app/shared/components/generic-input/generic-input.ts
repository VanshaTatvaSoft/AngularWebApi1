import { CommonModule, NgClass } from '@angular/common';
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
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'lib-generic-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatIconModule, MatButtonModule, NgClass, MatDatepickerModule, MatNativeDateModule, NgxMaterialTimepickerModule, MatSlideToggleModule],
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
  selectedFiles: { file: File; preview?: string }[] = [];

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
    if (errors['min']) return messages['min'] || `Min value of ${this.config.label} is ${errors['min'].min}`;
    if (errors['max']) return messages['max'] || `Max value of ${this.config.label} is ${errors['max'].max}`;
    if (errors['minlength']) return messages['minlength'] || `Minimum length is ${errors['minlength'].requiredLength}`;
    if (errors['maxlength']) return messages['maxlength'] || `Maximum length is ${errors['maxlength'].requiredLength}`;
    if (errors['pattern']) return messages['pattern'] || `Invalid format`;
    if (errors['matDatepickerMin']) return messages['matDatepickerMin'] || `Date must be on or after ${this.config.minDate?.toLocaleDateString()}`;
    if (errors['matDatepickerMax']) return messages['matDatepickerMax'] || `Date must be on or before ${this.config.maxDate?.toLocaleDateString()}`;
    if (errors['requiredTrue']) return messages['requiredTrue'] || `You must accept ${this.config.label}`;
    if (errors['matDatepickerParse']) return messages['matDatepickerParse'] || 'Invalid date format';
    if (errors['fileType']) return messages['fileType'] || errors['fileType'];

    const customKeys = Object.keys(errors).filter(
      key => !['required', 'minlength', 'maxlength', 'pattern', 'email', 'min', 'max', 'matDatepickerMin', 'matDatepickerMax', 'requiredTrue', 'matDatepickerParse', 'fileType'].includes(key)
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    const allowed = this.config.accept
      ? this.config.accept.split(',').map(ext => ext.trim().toLowerCase())
      : [];

    let invalidFiles: string[] = [];
    let validFiles: { file: File; preview?: string }[] = [];

    files.forEach(file => {
      const fileName = file.name.toLowerCase();
      const fileType = file.type.toLowerCase();

      const isValid = allowed.length === 0 || allowed.some(ext => {
        if (ext.startsWith('.')) {
          return fileName.endsWith(ext); // e.g. ".pdf"
        }
        if (ext.includes('/')) {
          const [typeGroup, subtype] = ext.split('/');
          if (subtype === '*') {
            return fileType.startsWith(typeGroup + '/'); // e.g. "image/*"
          }
          return fileType === ext;
        }
        return false;
      });

      if (!isValid) {
        invalidFiles.push(file.name);
        return; // skip adding to preview
      }

      let preview: string | undefined;
      if (this.config.showPreview && fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          const idx = validFiles.findIndex(f => f.file === file);
          if (idx !== -1) {
            validFiles[idx].preview = reader.result as string;
          }
        };
        reader.readAsDataURL(file);
      }

      validFiles.push({ file, preview });
    });

    this.selectedFiles = validFiles;

    let errors: ValidationErrors | null = null;

    // Invalid type check
    if (invalidFiles.length) {
      errors = { ...(errors || {}), fileType: `Invalid file type: ${invalidFiles.join(', ')}` };
    }

    // Apply errors to both controls so errorMessage always works
    this.internalControl.setErrors(errors);
    this.internalControl.markAsTouched();
    this.internalControl.markAsDirty();

    if (this.formControl) {
      this.formControl.setErrors(errors);
      this.formControl.markAsTouched();
      this.formControl.markAsDirty();
    }

    // Set value
    this.internalControl.setValue(validFiles.length ? validFiles.map(f => f.file) : null);
    if (this.formControl) {
      this.formControl.setValue(validFiles.length ? validFiles.map(f => f.file) : null);
    }

    // Propagate to form
    this.onChange(validFiles.length ? validFiles.map(f => f.file) : null);
  }

  getFileExtension(filename: string): string {
    const ext = filename.split('.').pop();
    return ext ? ext.toUpperCase() : '';
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    const control = this.formControl || this.internalControl;
    if (control) {
      const currentFiles: File[] = control.value || [];

      // Create a new array excluding the removed file
      const updatedFiles = currentFiles.filter((_, i) => i !== index);

      // Update the form control value
      control.setValue(updatedFiles);

      // Optionally mark the control as touched/dirty for validation
      control.markAsDirty();
      control.markAsTouched();
    }
  }

}
