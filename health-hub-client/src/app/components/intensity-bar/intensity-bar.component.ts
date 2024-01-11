import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-intensity-bar',
  templateUrl: './intensity-bar.component.html',
  styleUrls: ['./intensity-bar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IntensityBarComponent {


  selectedValue: any;
  cardioPoints: any;

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  constructor(
    public dialogRef: MatDialogRef<IntensityBarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Set the initial value to half of the maximum value
    this.selectedValue = data.duration;
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.dialogRef.close({ cardioPoints: this.selectedValue });
  }

}
