import { Routes } from '@angular/router';
import { UpdateProductComponent } from './core/components/update-product/update-product.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'updateProduct/:id',
    component: UpdateProductComponent
  },
];
