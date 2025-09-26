import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';

@Component({
  selector: 'fintracker-main',
  imports: [
    HeaderComponent,
    RouterOutlet,
],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class MainPage {

}
