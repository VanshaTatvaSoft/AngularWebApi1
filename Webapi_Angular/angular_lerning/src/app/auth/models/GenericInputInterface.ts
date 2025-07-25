import { AbstractControl, ValidationErrors } from '@angular/forms';

export interface GenericInputInterface {
  appearance: 'outline' | 'fill';
  type: string;
  placeholder: string;
  showRequiredStar?: boolean;
  value?: string;
  id: string;
  name: string;
  icon?: string | null;
  label: string;
  hint?: string | null;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  class?: string;
  customValidators?: ((control: AbstractControl) => ValidationErrors | null)[];
  customErrorMessages?: { [key: string]: string };
}
