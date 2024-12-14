import { AlertController } from '@ionic/angular';
import { Component, inject, OnInit, signal } from '@angular/core';
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
  productsSignal = signal<any[]>([]);
  filteredProductSignal = signal<any[]>([]);

  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertController = inject(AlertController);

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.productsSignal.set(this.productService.fetchProducts());
      this.filteredProductSignal.set(this.productsSignal());
    });
  }

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

  filterData(event: any) {
    let searchterm = event.target.value.toLowerCase();
    if (searchterm) {
      const filtered = this.productsSignal().filter(
        (product: any) =>
          product.name.toLowerCase().includes(searchterm) ||
          product.id.toString().toLowerCase().includes(searchterm) ||
          product.price.toString().toLowerCase().includes(searchterm) ||
          product.category.toLowerCase().includes(searchterm)
      );
      this.filteredProductSignal.set(filtered);
    } else {
      this.filteredProductSignal.set(this.productsSignal());
    }
  }

  updateProduct(id: any) {
    this.router.navigate(['updateProduct', id]);
  }

  delete(productId: number) {
    this.productService.deleteProduct(productId);
    this.productsSignal.set(this.productService.fetchProducts());
    this.filteredProductSignal.set(this.productsSignal());
  }
}
