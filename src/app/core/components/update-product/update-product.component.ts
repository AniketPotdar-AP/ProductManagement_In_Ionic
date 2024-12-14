import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonBackButton } from '@ionic/angular/standalone';
import { ionicImports } from 'src/app/shared/providers/ionic-imports';
import { ProductService } from '../../services/product.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
  standalone: true,
  imports: [IonBackButton, ionicImports, ReactiveFormsModule],
})
export class UpdateProductComponent implements OnInit {
  productId: any;
  productForm: any;

  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toasterService = inject(ToastController);

  constructor() {
    this.productForm = this.fb.group({
      id: [this.productId],
      name: ['', [Validators.required]],
      price: ['', [Validators.required]],
      category: ['', [Validators.required]],
      inStock: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.productId = params['id'];
        this.productForm.patchValue(this.productService.getProductById(this.productId))
      }
    });
  }

  updateProduct() {
    if (this.productForm.valid) {
      this.productService.updateProduct(this.productForm.value);
      this.router.navigate(['tabs/home']);
      this.presentToast('Product Updated Successfully');
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
