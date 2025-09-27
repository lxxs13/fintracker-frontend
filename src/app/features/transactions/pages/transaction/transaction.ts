import { Component } from '@angular/core';
import { Transaction } from "../../components/transaction/transaction";

@Component({
  selector: 'fintracker-transaction',
  imports: [Transaction],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css'
})
export class TransactionPage {

}
