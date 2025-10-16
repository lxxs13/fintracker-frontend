import { Component } from '@angular/core';
import { CalendarComponent } from "../../components/calendar/calendar";

@Component({
  selector: 'fintracker-calendar',
  imports: [CalendarComponent],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class CalendarPage {

}
