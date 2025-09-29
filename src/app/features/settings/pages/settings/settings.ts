import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TieredMenuModule } from 'primeng/tieredmenu';


@Component({
  selector: 'fintracker-settings',
  imports: [
    RouterOutlet,
    TieredMenuModule,
  ],
  templateUrl: './settings.html',
})
export class SettingsPage implements OnInit {
  private _router = inject(Router);

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Categorías',
        icon: 'pi pi-objects-column',
        command: () => this._router.navigateByUrl('dashboard/settings/categories'),
      },
    ]
  }
}
