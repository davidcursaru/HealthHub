import { Injectable } from '@angular/core';

interface SleepData {
  sleepStartTimeMillis: number;
  wakeUpTimeMillis: number;
}

@Injectable({
  providedIn: 'root',
})
export class SleepRegularityService {

  calculateAverageSleepStartTime(data: SleepData[]): string {
    const totalSleepStartTime = data.reduce((acc, entry) => acc + entry.sleepStartTimeMillis, 0);
    const averageSleepStartTime = totalSleepStartTime / data.length;

    return this.formatTime(averageSleepStartTime);
  }

  calculateAverageWakeUpTime(data: SleepData[]): string {
    const totalWakeUpTime = data.reduce((acc, entry) => acc + entry.wakeUpTimeMillis, 0);
    const averageWakeUpTime = totalWakeUpTime / data.length;

    return this.formatTime(averageWakeUpTime);
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
    const consistencyWeight = 0.5;
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


  private formatTime(timeInMillis: number): string {
    const formattedTime = new Date(timeInMillis).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return formattedTime;
  }
}
