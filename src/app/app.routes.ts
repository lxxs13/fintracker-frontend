import { MainPage } from './features/dashboard/pages/main/main';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    title: 'Iniciar Sesión',
    path: '',
    loadComponent: () => import('./core/auth/pages/login/login').then(c => c.LoginPage),
  },
  {
    title: 'Dashboard',
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/main/main').then(c => c.MainPage),
  }
];
