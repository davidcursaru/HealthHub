import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs/internal/observable/timer';

@Component({
  selector: 'app-live-clock',
  templateUrl: './live-clock.component.html',
  styleUrls: ['./live-clock.component.css']
})
export class LiveClockComponent implements OnInit {

  dateTime!: Date;

  ngOnInit() {
    timer(0, 1000).subscribe(() => {
      this.dateTime = new Date;
    })
  }

}
