import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../services/product';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Alert } from '../../shared/services/alert';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { GenericBtn } from '../../shared/components/generic-btn/generic-btn';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    GenericBtn
  ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {
  form: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<AddProduct>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toaster: ToastrService,
    private alert: Alert
  ) {
    this.form = this.fb.group({
      id: [null],
      productname: ['', Validators.required],
      productdesc: ['', Validators.required],
      productprice: [0, [Validators.required, Validators.min(1)]],
      productquantity: [1, [Validators.required, Validators.min(1)]],
    });

    if (data) {
      this.isEditMode = true;
      this.form.patchValue(data);
    }
  }

  submit(): void {
    if (this.form.valid) {
      const product = this.form.value;

      const action = this.isEditMode
        ? this.productService.updateProduct(product)
        : this.productService.addProduct(product);

      action.subscribe({
        next: (res) => {
          if (res.status) {
            this.alert.succuess(res.message);
            this.toaster.success(res.message);
            this.dialogRef.close(true);
          } else {
            this.toaster.error(res.message);
          }
        },
        error: () => this.toaster.error('Error adding product.'),
      });
    }
  }

  close(): void {
    this.dialogRef.close(true);
  }
}
