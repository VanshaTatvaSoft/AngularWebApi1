import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../services/product';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<AddProduct>
  ) {
    this.form = this.fb.group({
      productname: ['', Validators.required],
      productdesc: ['', Validators.required],
      productprice: [0, [Validators.required, Validators.min(0)]],
      productquantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  close(): void {
    this.dialogRef.close();
  }

}
