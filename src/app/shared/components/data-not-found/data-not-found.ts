import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'fintracker-data-not-found',
  imports: [],
  templateUrl: './data-not-found.html',
})
export class DataNotFoundComponent implements OnInit {
  @Input() message: string = '';

  randomIndex: number = 1;

  ngOnInit(): void {
    this.randomIndex = Math.floor(Math.random() * 4) + 1;
  }

}
