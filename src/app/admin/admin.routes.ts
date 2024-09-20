import { Routes } from '@angular/router';
import { GridProductsComponent } from './products/grid-products/grid-products.component';
import { FormProductsComponent } from './products/form-products/form-products.component';
export const ADMIN_ROUTES: Routes = [
  { path: '', component: GridProductsComponent },
  { path: 'productForm', component: FormProductsComponent },
];
