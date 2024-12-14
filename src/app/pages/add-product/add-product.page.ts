import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ionicImports } from 'src/app/shared/providers/ionic-imports';
import { ProductService } from 'src/app/core/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: true,
  imports: [ionicImports, CommonModule, FormsModule, ReactiveFormsModule],
})
export class AddProductPage implements OnInit {
  productForm: any;

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private toasterService = inject(ToastController);

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      category: ['', [Validators.required]],
      inStock: [true, [Validators.required]],
    });
  }

  ngOnInit() {}

  submit() {
    if (this.productForm.valid) {
      this.productService.addProduct(this.productForm.value);
      this.productForm.reset();
      this.router.navigate(['tabs/home']);
      this.presentToast('Product Added Successfully');
    }
  }

  async presentToast(message: any) {
    const toast = await this.toasterService.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }
}
