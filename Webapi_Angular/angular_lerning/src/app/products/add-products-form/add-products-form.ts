import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../services/product';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-products-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-products-form.html',
  styleUrl: './add-products-form.css'
})
export class AddProductsForm {
  addForm: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService,private toaster: ToastrService, private router: Router ){
    this.addForm = this.fb.group({
      productname: ["",Validators.required],
      productdesc: ["",Validators.required],
      productprice: [0, [Validators.required, Validators.min(1)]],
      productquantity: [1, [Validators.required, Validators.min(1)]],
    });

  }

  submit(): void{
    if(this.addForm.valid){
      const product = this.addForm.value;
      this.productService.addProduct(product).subscribe({
        next: (res) => {
          if(res.status){
            this.toaster.success(res.message);
            this.router.navigate(['/products']);
          }
          else{
            this.toaster.error(res.message);
          }
        },
        error: () => this.toaster.error('Error adding product.'),
      });
    }
  }

}
