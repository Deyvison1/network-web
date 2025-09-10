import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { UserComponent } from './admin/user/user.component';
import { AuthGuard } from './auth/auth.guard';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { CategoryComponent } from './admin/category/category.component';
import { ProductComponent } from './admin/product/product.component';
import { RoleComponent } from './admin/user/role/role.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'role',
    component: RoleComponent,
  },
  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'product', component: ProductComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
