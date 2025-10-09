import { Routes } from '@angular/router';
import { canAccessGuard } from './core/guards/can-access-guard';

export const routes: Routes = [
  {
    title: 'Iniciar Sesión',
    path: '',
    loadComponent: () => import('./core/auth/pages/login/login').then(c => c.LoginPage),
  },
  {
    title: 'Dashboard',
    path: 'dashboard',
    canActivate: [canAccessGuard],
    canActivateChild: [canAccessGuard],
    loadComponent: () => import('./features/dashboard/pages/main/main').then(c => c.MainPage),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard').then(c => c.DashboardPage),
      },
      {
        path: 'calendar',
        title: 'Calendario',
        loadComponent: () => import('./features/calendar/pages/calendar/calendar').then(c => c.CalendarPage),
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/pages/reports/reports').then(c => c.ReportsPage),
      },
      {
        path: 'accounts',
        loadComponent: () => import('./features/accounts/pages/account/account').then(c => c.AccountPage),
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/pages/transaction/transaction').then(c => c.TransactionPage),
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/pages/settings/settings').then(c => c.SettingsPage),
        children: [
          {
            path: 'categories',
            loadComponent: () => import ('./features/settings/components/categories/categories').then(c => c.CategoriesComponent)
          }
        ]
      }
    ]
  }
];
