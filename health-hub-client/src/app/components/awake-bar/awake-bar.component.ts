import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-awake-bar',
  templateUrl: './awake-bar.component.html',
  styleUrls: ['./awake-bar.component.css']
})
export class AwakeBarComponent {
  @Input() userPercentage: any;
  progressMessage: any;
  progressMessageColor: any;

  getBarColor(intervalThreshold: number): string {
    
    if (this.userPercentage <= 3) {
      return intervalThreshold === 1 ? 'green' : '#eaeaea';
    } else if (this.userPercentage > 3) {
      return intervalThreshold === 2 ? 'red' : '#eaeaea';
    }

    return '#eaeaea';
  }



  updateProgressMessage(value: number): { title: string, color: string } {
    if (value <= 3) {
      return { title: 'Good', color: 'green' };
    } else if (value > 3) {
      return { title: 'Pay attention', color: 'red' };
    }

    return { title: 'No sleep data available', color: 'black' };
  }

}
