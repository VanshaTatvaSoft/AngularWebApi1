import { AbstractControl, ValidationErrors } from '@angular/forms';

export interface GenericInputInterface {
  appearance: 'outline' | 'fill';
  type: string;
  placeholder: string;
  showRequiredStar?: boolean;
  value?: any;
  id: string;
  name: string;
  icon?: string | null;
  label: string;
  labelPosition?: 'before' | 'after';
  hint?: string | null;
  disabled?: boolean;
  rows?: number;
  options?: { value: string; label: string }[];
  class?: string;
  customValidators?: ((control: AbstractControl) => ValidationErrors | null)[];
  customErrorMessages?: { [key: string]: string };
  minDate?: Date;
  maxDate?: Date;
  startView?: 'month' | 'year' | 'multi-year';
  accept?: string;         // Allowed file types e.g. "image/*,.pdf"
  // multiple?: boolean;      // Allow multiple file selection
  showPreview?: boolean;
}
