export type ButtonFramework = 'bootstrap' | 'material';
export type ButtonVariant = 'basic' | 'raised' | 'flat' | 'stroked' | 'fab' | 'mini-fab';

export interface GenericButtonConfig {
  label?: string;
  type?: 'button' | 'submit' | 'reset';
  color?: 'primary' | 'accent' | 'warn' | 'success' | 'danger' | 'secondary';
  icon?: string;
  framework?: ButtonFramework;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: ButtonVariant;
  tooltip?: string;
  size?: 'sm' | 'md' | 'lg';
  iconPosition?: 'start' | 'end';
}