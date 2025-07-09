import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component/login.component';
import { Dashboard } from './dashboard/dashboard';
import { authGaurdGuard } from './auth/auth.gaurd-guard';
import { RegisterComponent } from './auth/register.component/register.component';
import { LoginLayoutComponent } from './layouts/login-layout.component/login-layout.component';
import { MainLayoutComponent } from './layouts/main-layout.component/main-layout.component';
import { Products } from './products/products';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: Dashboard, canActivate: [authGaurdGuard] },
      { path: 'products', component: Products, canActivate: [authGaurdGuard] }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
