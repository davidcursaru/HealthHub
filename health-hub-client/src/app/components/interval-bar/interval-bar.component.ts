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
    if (this.userPercentage !== undefined) {
      if (this.userPercentage < 10) {
        return intervalThreshold === 10 ? 'red' : '#eaeaea';
      } else if (this.userPercentage >= 10 && this.userPercentage <= 35) {
        return intervalThreshold === 25 ? 'green' : '#eaeaea';
      } else if (this.userPercentage > 35) {
        return intervalThreshold === 70 ? 'red' : '#eaeaea';
      }
    }
    return '#eaeaea';
  }

  updateProgressMessage(value: number) {
    if (value < 10) {
        this.progressMessage = 'Accord Care';
        this.progressMessageColor = 'red';
    } else if (value >= 10 && value <= 35) {
        this.progressMessage = 'Good';
        this.progressMessageColor = '#4cae4c'; // Lighter green
    } else {
        this.progressMessage = 'Accord care';
        this.progressMessageColor = 'red'; // Darker green
    }

    return [this.progressMessage, this.progressMessageColor];
}


}
