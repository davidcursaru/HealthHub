import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-interval-bar',
  templateUrl: './interval-bar.component.html',
  styleUrls: ['./interval-bar.component.css']
})
export class IntervalBarComponent {
  @Input() userPercentage: any; // Input the user's percentage
  progressMessage: any;
  progressMessageColor: any;

  getBarColor(intervalThreshold: number): string {

    if (this.userPercentage < 10 && this.userPercentage != 0) {
      return intervalThreshold === 10 ? 'red' : '#eaeaea';
    } else if (this.userPercentage >= 10 && this.userPercentage <= 35) {
      return intervalThreshold === 25 ? 'green' : '#eaeaea';
    } else if (this.userPercentage > 35) {
      return intervalThreshold === 70 ? 'red' : '#eaeaea';
    }

    return '#eaeaea';
  }



  updateProgressMessage(value: number): { title: string, color: string } {
    if (value < 10 && value != 0) {
      return { title: 'Pay attention', color: 'red' };
    } else if (value >= 10 && value <= 35) {
      return { title: 'Good', color: 'green' };
    } else if (value > 35) {
      return { title: 'Pay attention', color: 'red' };
    }

    return { title: 'No sleep data available', color: 'black' };

  }


}
