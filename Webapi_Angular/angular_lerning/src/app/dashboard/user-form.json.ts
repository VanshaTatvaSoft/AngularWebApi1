import { GenericFormInterface } from '../auth/models/GenericFormInterface';
import { Validators } from '@angular/forms';

export const userFormJSON: GenericFormInterface = {
  fields: [
    {
      type: 'text',
      label: 'Name',
      class: 'col-6 pe-1',
      name: 'name',
      id: 'userName',
      placeholder: 'Enter your name',
      customValidators: [Validators.required, Validators.minLength(3)],
      appearance: 'outline'
    },
    {
      type: 'email',
      label: 'Email',
      class: 'col-6',
      name: 'email',
      placeholder: 'Enter your email',
      customValidators: [Validators.required, Validators.email],
      appearance: 'outline',
      id: 'userEmail'
    },
    {
      type: 'password',
      label: 'Password',
      class: 'col-6 pe-1',
      name: 'password',
      placeholder: 'Enter password',
      customValidators: [Validators.required],
      appearance: 'outline',
      id: 'password'
    },
    {
      type: 'number',
      label: 'Age',
      class: 'col-6',
      name: 'age',
      placeholder: 'Enter your age',
      customValidators: [Validators.required, Validators.min(0), Validators.max(120)],
      appearance: 'outline',
      id: 'userAge'
    },
    {
      type: 'select',
      label: 'Gender',
      class: 'col-12',
      name: 'gender',
      placeholder: 'Select gender',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' }
      ],
      customValidators: [Validators.required],
      appearance: 'outline',
      id: 'userGender'
    },
    {
      type: 'textarea',
      label: 'Bio',
      name: 'bio',
      class: 'col-12',
      rows: 3,
      placeholder: 'Write a short bio',
      customValidators: [Validators.required, Validators.maxLength(100)],
      appearance: 'outline',
      id: 'userBio'
    },
    {
      type: 'checkbox',
      label: 'Accept Terms',
      name: 'acceptTerms',
      class: 'col-2',
      customValidators: [Validators.requiredTrue],
      appearance: 'outline',
      id: 'userCheckbox',
      placeholder: ''
    },
    {
      type: 'radio',
      label: 'Subscription',
      name: 'subscription',
      class: 'col-3',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Premium', value: 'premium' }
      ],
      customValidators: [Validators.required],
      appearance: 'outline',
      id: 'userSubscription',
      placeholder: ''
    },
    {
      type: 'date',
      label: 'Birth Date',
      name: 'dob',
      class: 'col-6 ps-1',
      placeholder: 'Choose your date of birth',
      customValidators: [Validators.required],
      appearance: 'outline',
      id: 'userDOB'
    },
    {
      type: 'text',
      label: 'Phone Number',
      name: 'phone',
      class: 'col-6 ps-1',
      placeholder: 'Enter your phone number',
      customValidators: [Validators.required, Validators.pattern(/^\d{10}$/)],
      appearance: 'outline',
      id: 'userPhoneNumber'
    }
  ],
  submitButtonLabel: 'Register',
  cancelButtonLabel: 'Reset'
};
