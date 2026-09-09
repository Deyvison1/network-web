import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AuthGuard } from './auth/auth.guard';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { CategoryComponent } from './admin/category/category.component';
import { ProductComponent } from './admin/product/product.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
  },
  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'product', component: ProductComponent, canActivate: [AuthGuard] },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
