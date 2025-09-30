import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'fintracker-main',
  imports: [
    HeaderComponent,
    RouterOutlet,
    ToastModule,
],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class MainPage {

}
