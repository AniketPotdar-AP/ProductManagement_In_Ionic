import { AlertController } from '@ionic/angular';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ionicImports } from 'src/app/shared/providers/ionic-imports';
import { ProductService } from 'src/app/core/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [ionicImports, CommonModule, FormsModule],
})
export class HomePage implements OnInit {
  productsSignal: any;
  filteredProduct: any;

  async presentAlert(id: number) {
    const alert = await this.alertController.create({
      header: 'Delete Product',
      message: 'Are you sure you want to delete the product?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { },
        },
        {
          text: 'Delete',
          role: 'confirm',
          handler: () => {
            this.delete(id);
          },
        },
      ],
    });

    await alert.present();
  }

  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertController = inject(AlertController);

  constructor() { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productsSignal = this.productService.fetchProducts();
    });
    this.filteredProduct = this.productsSignal;
  }

  filterData(event: any) {
    let searchterm = event.target.value;
    if (searchterm) {
      this.productsSignal = this.productsSignal.filter((product: any) =>
        product.name.toLowerCase().includes(searchterm.toLowerCase()) ||
        product.id.toString().toLowerCase().includes(searchterm.toLowerCase()) ||
        product.price.toString().toLowerCase().includes(searchterm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchterm.toLowerCase())
      );
    } else {
      this.productsSignal = this.filteredProduct;
    }
  }

  updateProduct(id: any) {
    this.router.navigate(['updateProduct', id]);
  }

  delete(productId: number) {
    this.productService.deleteProduct(productId);
    this.ngOnInit();
  }
}
