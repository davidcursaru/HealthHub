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
  intensityMessage: any;

  constructor(
    public dialogRef: MatDialogRef<IntensityBarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Set the initial value to half of the maximum value
    this.selectedValue = data.duration;
    this.updateIntensityMessage();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.dialogRef.close({ cardioPoints: this.selectedValue });
  }

  onIntensityChange(): void {
    // Adjust the intensityMessage based on the slider change
    this.updateIntensityMessage();
  }

  private updateIntensityMessage(): void {
    const halfDuration = this.data.duration / 2;
    if (this.selectedValue < halfDuration) {
      this.intensityMessage = 'Normal breathing, you can hold a conversation or sing';
    } else if (this.selectedValue >= halfDuration && this.selectedValue < halfDuration * 3) {
      this.intensityMessage = 'Breathing with difficulty, you can have a short conversation, but you cannot sing.';
    } else {
      this.intensityMessage = 'Shortness of breath, you can only speak in short sentences.';
    }
  }

}
