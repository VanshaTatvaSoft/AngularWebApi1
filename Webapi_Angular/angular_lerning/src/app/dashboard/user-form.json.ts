import { Validators } from '@angular/forms';
import { GenericFormInterface } from '../auth/models/GenericFormInterface';
// import { GenericFormInterface } from '@vanshasomani/generic-form';

export const userFormJSON: GenericFormInterface = {
  fields: [
    {
      type: 'text',
      label: 'Name',
      icon: 'person',
      class: 'col-lg-6 col-sm-12 pe-1',
      name: 'name',
      value: 'Vansha Somani',
      id: 'userName',
      placeholder: 'Enter your name',
      customValidators: [Validators.required, Validators.minLength(3)],
      appearance: 'outline',
      customErrorMessages: {
        required: 'First name is required'
      }
    },
    {
      type: 'email',
      label: 'Email',
      class: 'col-lg-6 col-sm-12 pe-1',
      icon: 'email',
      name: 'email',
      value: 'vanshasomani0@gmail.com',
      placeholder: 'Enter your email',
      customValidators: [Validators.required, Validators.email],
      appearance: 'outline',
      id: 'userEmail'
    },
    {
      type: 'password',
      label: 'Password',
      value: 'Vansha@1234',
      class: 'col-lg-6 col-sm-12 pe-1',
      name: 'password',
      placeholder: 'Enter password',
      customValidators: [Validators.required],
      appearance: 'outline',
      id: 'password'
    },
    {
      type: 'number',
      label: 'Age',
      value: 21,
      class: 'col-lg-6 col-sm-12 pe-1',
      icon: 'person',
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
      value: 'male',
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
      value: 'Hi I am Vansha!',
      rows: 3,
      placeholder: 'Write a short bio',
      customValidators: [Validators.required, Validators.maxLength(100)],
      appearance: 'outline',
      id: 'userBio'
    },
    {
      type: 'checkbox',
      label: 'Accept Terms',
      value: true,
      name: 'acceptTerms',
      class: 'col-lg-6',
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
      value: 'free',
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
      class: 'col-lg-6 col-sm-12 ps-1',
      value: new Date(),
      placeholder: 'Choose your date of birth',
      customValidators: [Validators.required],
      appearance: 'outline',
      minDate: new Date(),
      id: 'userDOB'
    },
    {
      type: 'text',
      label: 'Phone Number',
      icon: 'phone',
      name: 'phone',
      class: 'col-lg-6 col-sm-12 ps-1',
      value: '9558383395',
      placeholder: 'Enter your phone number',
      customValidators: [Validators.required, Validators.pattern(/^\d{10}$/)],
      appearance: 'outline',
      id: 'userPhoneNumber'
    },
    {
      type: 'time picker',
      label: 'Preferred Contact Time',
      name: 'contactTime',
      class: 'col-lg-6 col-sm-12 ps-1',
      placeholder: 'Select time',
      value: '1:30 PM',
      customValidators: [Validators.required],
      appearance: 'outline',
      id: 'userContactTime',
    },
    {
      type: 'slide toggle',
      label: 'Are you sure',
      name: 'Confirm',
      class: 'col-lg-3 col-sm-12 ps-1',
      placeholder: '',
      value: true,
      // disabled: true,
      customValidators: [Validators.required, Validators.requiredTrue],
      appearance: 'outline',
      id: 'userContactTime'
    },
    {
      type: 'file',
      label: 'Upload PDF',
      appearance: 'outline',
      class: 'col-lg-3',
      accept: '.pdf, .png',
      // multiple: true,
      showPreview: true,
      placeholder: '',
      id: 'fileInput',
      hint: 'Select .png or .pdf file',
      name: 'userFile',
      customValidators: [Validators.required]
    }
  ],
  submitButtonLabel: 'Register',
  cancelButtonLabel: 'Reset'
};
