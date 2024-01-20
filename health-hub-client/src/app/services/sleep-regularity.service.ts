import { Injectable } from '@angular/core';
import * as moment from 'moment';

interface SleepData {
  sleepStartTimeMillis: number;
  wakeUpTimeMillis: number;
}

@Injectable({
  providedIn: 'root',
})
export class SleepRegularityService {

  calculateAverageSleepStartTime(data: SleepData[]): string {
    // Convert sleep start times to hours in 24-hour format
    const sleepStartHoursArray = data.map(entry => {
      const sleepStartTime = moment(entry.sleepStartTimeMillis).format('HH:mm');
      return sleepStartTime;
    });
    console.log("start hours array: ", sleepStartHoursArray);

    // Parse hours using moment
    const parsedHours = sleepStartHoursArray.map(hour => moment(hour, 'HH:mm'));

    // Calculate the total number of minutes
    const totalFloatValues = parsedHours.reduce((sum, hour) => sum + this.timeToFloat(hour.format('HH:mm')), 0);

    // Calculate the average
    const averageFloatValue = totalFloatValues / sleepStartHoursArray.length;
    console.log("total float value: ", averageFloatValue);

    // Split the float value into integer and decimal parts
// Split the float value into integer and decimal parts
const [integerPart, decimalPart] = averageFloatValue.toFixed(12).split('.');
const decimalPartString = decimalPart.length > 2 ? decimalPart.slice(0, 2) : decimalPart;

// Convert the extracted string back to a number
const firstTwoDigits = parseInt(decimalPartString, 10);

    // Extract the first two characters
    const firstTwoDigitsString = decimalPartString[0] === '0' ? decimalPartString.slice(0, 0) : decimalPartString.slice(0, 2);
    console.log("first 2 digits string: ", decimalPartString);
    
    // Convert the extracted string back to a number
  

    // Handle the left part (hours)
    const adjustedHours = Number(integerPart) >= 24 ? Number(integerPart) - 24 : Number(integerPart);

    const adjustedMinutes = Math.round(firstTwoDigits / 10 / 0.166666666666666666666666666);
    console.log("adjusted time: ",adjustedMinutes);

    // Determine AM/PM
    const period = adjustedHours >= 12 ? 'PM' : 'AM';

    // Convert back to hh:mm AM/PM format
    const averageHour = `${adjustedHours % 12 || 12}:${adjustedMinutes.toString().padStart(2, '0')} ${period}`;

    return averageHour;
  }

  timeToFloat(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    let floatValue = hours + minutes / 60;

    // Handle the case where the input time is after 24:00
    if (floatValue < 7) {
      floatValue += 24;
    }

    console.log("floatValues: ", floatValue);
    return floatValue;
  }

  calculateAverageWakeUpTime(data: SleepData[]): string {
    // Convert wake up times to hours in 24-hour format
    const wakeUpHoursArray = data.map(entry => {
      const wakeUpTime = moment(entry.wakeUpTimeMillis).format('hh:mm A');
      return wakeUpTime;
    });

    // Parse hours using moment
    const parsedHours = wakeUpHoursArray.map(hour => moment(hour, 'hh:mm A'));

    // Calculate the total number of minutes
    const totalMinutes = parsedHours.reduce((sum, hour) => sum + hour.hours() * 60 + hour.minutes(), 0);

    // Calculate the average
    const averageMinutes = totalMinutes / wakeUpHoursArray.length;

    // Convert back to hh:mm A format
    const averageWakeUpTime = moment().startOf('day').add(averageMinutes, 'minutes').format('hh:mm A');

    return averageWakeUpTime;
  }

  convertTimeToMinutes(timeString: string): number {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    let totalMinutes = hours * 60 + minutes;

    // Adjust for AM/PM
    if (period && period.toLowerCase() === 'pm') {
      totalMinutes += 12 * 60; // Add 12 hours for PM
    }

    return totalMinutes;
  }

  calculateSRI(sleepData: SleepData[]): number {
    const consistencyWeight = 0.6;
    const totalSleepPeriods = sleepData.length;

    // Calculate the consistency score based on sleep timing
    const consistencyScore = this.calculateConsistencyScore(sleepData);

    // Calculate the overall SRI score
    const sriScore = consistencyWeight * consistencyScore;

    // You can adjust the range and scale based on your preferences
    const sriPercentage = Math.round(sriScore * 100);

    return sriPercentage;
  }

  private calculateConsistencyScore(sleepData: SleepData[]): number {
    // Sort sleep data by sleep start time
    const sortedData = sleepData.slice().sort((a, b) => a.sleepStartTimeMillis - b.sleepStartTimeMillis);

    // Calculate the time difference between consecutive sleep periods
    const timeDifferences = [];
    for (let i = 1; i < sortedData.length; i++) {
      const timeDiff = sortedData[i].sleepStartTimeMillis - sortedData[i - 1].sleepStartTimeMillis;
      timeDifferences.push(timeDiff);
    }

    // Calculate the standard deviation of time differences
    const meanTimeDifference = this.calculateMean(timeDifferences);
    const squaredDifferences = timeDifferences.map(diff => Math.pow(diff - meanTimeDifference, 2));
    const variance = this.calculateMean(squaredDifferences);
    const consistencyScore = 1 - Math.sqrt(variance) / meanTimeDifference;

    return consistencyScore;
  }

  private calculateMean(values: number[]): number {
    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / values.length;
  }


  formatTime(timeInMillis: number): string {
    const formattedTime = new Date(timeInMillis).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return formattedTime;
  }

  formatTimeChart(timeInMillis: number): Date {
    const formattedTime = new Date(timeInMillis);

    return formattedTime;
  }
}
