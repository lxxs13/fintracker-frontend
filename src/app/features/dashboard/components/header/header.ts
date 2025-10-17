import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'fintracker-header',
  imports: [
    MenubarModule,
    AvatarModule,
    InputTextModule,
    MenuModule,
  ],
  templateUrl: './header.html',
})
export class HeaderComponent {
  private _router = inject(Router);

  headerMenuItems: MenuItem[] | undefined;
  userMenuItems: MenuItem[] | undefined;

  initialsUserName: string = 'LS';

  ngOnInit() {
    this.userMenuItems = [
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        routerLink: '/',
      },
    ];

    this.headerMenuItems = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/dashboard',
      },
      {
        label: 'Calendario',
        icon: 'pi pi-calendar',
        routerLink: 'calendar',
      },
      {
        label: 'Resumen',
        icon: 'pi pi-chart-pie',
        routerLink: 'reports'
      },
      {
        label: 'Cuentas',
        icon: 'pi pi-wallet',
        routerLink: 'accounts',
      },
      {
        label: 'Transacciones',
        icon: 'pi pi-replay',
        routerLink: 'transactions'
      },
      // {
      //   label: 'Configuración',
      //   icon: 'pi pi-cog',
      //   routerLink: 'settings'
      // },
    ]
  }
}
