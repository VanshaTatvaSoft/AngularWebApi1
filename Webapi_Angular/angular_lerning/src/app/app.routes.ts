import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component/login.component';
import { Dashboard } from './dashboard/dashboard';
import { authGaurdGuard } from './auth/auth.gaurd-guard';
import { RegisterComponent } from './auth/register.component/register.component';
import { LoginLayoutComponent } from './layouts/login-layout.component/login-layout.component';
import { MainLayoutComponent } from './layouts/main-layout.component/main-layout.component';
import { Products } from './products/products';
import { NotFound } from './error/not-found/not-found';
import { Forbiden } from './error/forbiden/forbiden';
import { roleGuard } from './shared/guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: Dashboard, canActivate: [authGaurdGuard] },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/products').then((m) => m.Products),
        canActivate: [authGaurdGuard, roleGuard],
        data: { roles: ['Admin'] }
      },
      {
        path: 'addproduct',
        loadComponent: () =>
          import('./products/add-products-form/add-products-form').then((m) => m.AddProductsForm),
        canActivate: [authGaurdGuard]
      }
    ],
  },
  { path: 'AccessDenied', component: Forbiden },
  { path: '**', component: NotFound },
];
