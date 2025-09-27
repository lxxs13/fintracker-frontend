import { Component, Input } from '@angular/core';

@Component({
  selector: 'fintracker-transaction-detail',
  imports: [],
  templateUrl: './transaction-detail.html',
  styleUrl: './transaction-detail.css'
})
export class TransactionDetailComponent {
  @Input() title: string = '';

}
