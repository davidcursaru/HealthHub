// Import necessary modules and components
import { Component, OnInit } from '@angular/core';
import { Chart, ChartData } from 'chart.js';
import { HydrationLogs } from 'src/app/interfaces/hydrationLogs.interface';
import { UserService } from 'src/app/services/user.service';
import { NutritionLogs } from 'src/app/interfaces/nutritionLogs.interface';
import { ExerciseLogs } from 'src/app/interfaces/exerciseLogs.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  currentDayStartDate: moment.Moment = moment().startOf('day');
  currentDayEndDate: moment.Moment = moment().endOf('day');
  currentDayChart: string = this.currentDayStartDate.format('D MMM YYYY');

  // Properties to store date range for the current week
  currentWeekStartDate: moment.Moment = moment().startOf('week');
  currentWeekEndDate: moment.Moment = moment().endOf('week');

  currentMonthStartDate: moment.Moment = moment().startOf('month');
  currentMonthEndDate: moment.Moment = moment().endOf('month');
  currentYearChart: string = this.currentMonthStartDate.format('YYYY');
  currentDateDisplay: string = '';

  userId: any;

  // Properties for chart data and options
  public chart: any;
  data: number[] = [];
  chartData: ChartData = { datasets: [] };
  chartLabels: string[] = [];
  selectedInterval: string = 'day'; // Default interval is set to 'day'
  dataLogs: any[] = [];
  selectedReport: string = 'Hydration';
  dataTypeReport: any;

  // Constructor with dependency injection for UserService
  constructor(private userService: UserService) { }

  // Lifecycle hook - ngOnInit
  ngOnInit() {
    this.getHydrationLogs(); // Fetch initial data
  }

  changeReportType(): void {
    if (this.selectedReport === 'Hydration') {
      this.getHydrationLogs();
    }
    else if (this.selectedReport == 'Calories Intake') {
      this.getNutritionLogs();
    }
    else if (this.selectedReport == 'Calories Burned') {
      this.getExerciseLogs();
    }
    else if (this.selectedReport == 'Exercise Minutes') {
      this.getExerciseLogs();
    }
    this.updateChartData();
  }

  // Method to fetch hydration logs from the service
  getHydrationLogs() {
    this.userService.getAllHydrationLogs().subscribe(
      (res: HydrationLogs[]) => {
        this.dataLogs = res;
        this.updateChartData();
      },
      (error) => {
        console.log("Error retrieving hydrationLogs in Reports: ", error);
      }
    );
  }

  getNutritionLogs() {
    this.userService.getAllNutritionLogs().subscribe(
      (res: NutritionLogs[]) => {
        this.dataLogs = res;
        this.updateChartData();
      },
      (error) => {
        console.log("Error retrieving nutritionLogs in Reports: ", error);
      }
    );
  }

  getExerciseLogs() {
    this.userService.getAllExerciseLogs().subscribe(
      (res: ExerciseLogs[]) => {
        this.dataLogs = res;
        this.updateChartData();
      },
      (error) => {
        console.log("Error retrieving exerciseLogs in Reports: ", error);
      }
    );
  }

  // Method to update chart data based on selected interval
  updateChartData(): void {
    this.data = [];
    this.chartLabels = [];

    switch (this.selectedInterval) {
      case 'day':
        this.filterByDay();
        break;
      case 'week':
        this.filterByWeek();
        break;
      case 'month':
        this.filterByMonth();
        break;
      case 'year':
        this.filterByYear();
        break;
      default:
        break;
    }
  }

  // Method to create and render the chart
  createChart(): void {
    if (this.chart) {
      this.chart.destroy(); // Destroy the existing chart if it exists
    }

    const sortedData = this.sortChartLabels(this.chartLabels, this.selectedInterval);

    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: sortedData.labels,
        datasets: [
          {
            label: this.selectedReport,
            data: sortedData.data,
            backgroundColor: '#076c8c', // Bar color
            barThickness: 30,
            borderRadius: 0 // Bar border radius
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        aspectRatio: 1.9,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '',
              color: 'blue'
            }
          },
          x: {
            title: {
              display: true,
              text: '',
              color: 'blue'
            }
          }
        }
      }
    });
  }

  // Method to move to the previous week in the chart
  moveToPreviousWeek() {
    if (this.selectedInterval === 'day') {
      this.currentDayStartDate = this.currentDayStartDate.clone().subtract(1, 'day').startOf('day');
      this.currentDayEndDate = this.currentDayEndDate.clone().subtract(1, 'day').endOf('day');
      this.currentDateDisplay = this.currentDayStartDate.format('D MMM YYYY');
    }
    else if (this.selectedInterval === 'week') {
      this.currentWeekStartDate = this.currentWeekStartDate.clone().subtract(1, 'week').startOf('week');
      this.currentWeekEndDate = this.currentWeekEndDate.clone().subtract(1, 'week').endOf('week');
    }
    else if (this.selectedInterval === 'month') {
      this.currentMonthStartDate = this.currentMonthStartDate.clone().subtract(12, 'month').startOf('month');
      this.currentMonthEndDate = this.currentMonthEndDate.clone().subtract(12, 'month').endOf('month');
      this.currentDateDisplay = this.currentMonthEndDate.format('YYYY');
    }
    this.updateChartData();
  }


  // Method to move to the next week in the chart
  moveToNextWeek() {
    if (this.selectedInterval === 'day') {
      this.currentDayStartDate = this.currentDayStartDate.clone().add(1, 'day').startOf('day');
      this.currentDayEndDate = this.currentDayEndDate.clone().add(1, 'day').endOf('day');
      this.currentDateDisplay = this.currentDayStartDate.format('D MMM YYYY');
    }
    else if (this.selectedInterval === 'week') {
      this.currentWeekStartDate = this.currentWeekStartDate.clone().add(1, 'week').startOf('week');
      this.currentWeekEndDate = this.currentWeekEndDate.clone().add(1, 'week').endOf('week');
    }
    else if (this.selectedInterval === 'month') {
      this.currentMonthStartDate = this.currentMonthStartDate.clone().add(12, 'month').startOf('month');
      this.currentMonthEndDate = this.currentMonthEndDate.clone().add(12, 'month').endOf('month');
      this.currentDateDisplay = this.currentMonthEndDate.format('YYYY');
    }
    this.updateChartData();
  }

  // Methods to filter data based on different intervals
  filterByDay(): void {
    const groupedData = this.groupByDate(this.dataLogs, 'day');
    this.aggregateData(groupedData);
  }

  filterByWeek(): void {
    const groupedData = this.groupByDate(this.dataLogs, 'week');
    this.aggregateData(groupedData);
  }

  filterByMonth(): void {
    const groupedData = this.groupByDate(this.dataLogs, 'month');
    this.aggregateData(groupedData);
  }

  filterByYear(): void {
    const groupedData = this.groupByDate(this.dataLogs, 'year');
    this.aggregateData(groupedData);
  }

  getEntityDate() {
    if (this.selectedReport === 'Hydration') {
      return 'hydrationDate';
    }
    else if (this.selectedReport === 'Calories Intake') {
      return 'consumptionDate';
    }
    else if (this.selectedReport === 'Exercise Minutes') {
      return 'exerciseDate';
    }
    else if (this.selectedReport === 'Calories Burned') {
      return 'exerciseDate';
    }
    return "date not found";
  }

  getEntityData() {
    if (this.selectedReport === 'Hydration') {
      return 'liters';
    }
    else if (this.selectedReport === 'Calories Intake') {
      return 'calories';
    }
    else if (this.selectedReport === 'Calories Burned') {
      return 'burnedCalories';
    }
    else if (this.selectedReport === 'Exercise Minutes') {
      return 'exerciseDuration';
    }
    return "data not found";
  }

  // Method to group data by date based on the selected interval
  groupByDate(data: any[], interval: string): Map<string, number> {
    const groupedMap: any = new Map<string, number>();

    data.forEach(log => {
      const dateField = this.getEntityDate();
      const dataField = this.getEntityData();
      const date = new Date(log[dateField]);
      let key = '';
      // console.log(date)

      switch (interval) {
        case 'day':
          // Group data by hour for the selected day
          const startDateOfDay = this.currentDayStartDate;
          const endDateOfDay = this.currentDayEndDate;
          const logsForDay = data.filter((log) => {
            const logDate = moment(log[dateField]);
            return logDate.isBetween(startDateOfDay, endDateOfDay, null, '[]');
          });

          this.currentDateDisplay = this.currentDayStartDate.format('D MMM YYYY');

          for (let i = 0; i < 24; i++) {
            const currentHourLogs = logsForDay.filter((log) => {
              const logHour = moment(log[dateField]).hour();
              return logHour === i;
            });

            const hourName = moment().hour(i).format('HH');
            groupedMap.set(hourName, currentHourLogs.reduce((total, log) => total + log[dataField], 0));
          }
          break;

        case 'week':
          // Group data by day for the selected week
          const startDateOfWeek = this.currentWeekStartDate;
          const endDateOfWeek = moment().endOf('week').toDate();

          const daysInWeek = [];
          for (let i = 0; i < 7; i++) {
            const currentDay = moment(startDateOfWeek).add(i, 'days').format('YYYY-MM-DD');
            daysInWeek.push(currentDay);
          }

          daysInWeek.forEach((day) => {
            const logsForDay = data.filter((log) => {
              const logDate = moment(log[dateField]).format('YYYY-MM-DD');
              return logDate === day;
            });

            const dayName = moment(day).format('ddd, MMM DD');
            groupedMap.set(dayName, logsForDay.reduce((total, log) => total + log[dataField], 0));
          });

          groupedMap.delete("");
          break;

        case 'month':
          // Group data by month for the selected year
          const startDateOfYear = this.currentMonthStartDate;
          const endDateOfYear = this.currentMonthEndDate;
          const currentYear = startDateOfYear.year();


          const logsForYear = data.filter((log) => {
            const logYear = moment(log[dateField]).year();
            return logYear === currentYear;
          });

          for (let i = 0; i < 12; i++) {
            const currentMonthLogs = logsForYear.filter((log) => {
              const logMonth = moment(log[dateField]).month();
              return logMonth === i;
            });

            const monthName = moment().month(i).format('MMM');
            groupedMap.set(monthName, currentMonthLogs.reduce((total, log) => total + log[dataField], 0));
          }
          this.currentDateDisplay = this.currentMonthEndDate.format('YYYY');
          break;

        case 'year':
          // Group data by year
          const yearKey = date.getFullYear().toString();
          key = yearKey;
          break;

        default:
          break;
      }

      if (groupedMap.has(key)) {
        groupedMap.set(key, groupedMap.get(key) + log[dataField]);
      } else {
        groupedMap.set(key, log[dataField]);
      }
    });

    return groupedMap;
  }

  // Method to sort chart labels based on the selected interval
  private sortChartLabels(labels: string[], interval: string): { labels: string[], data: number[] } {
    let sortedLabels: string[];
    let sortedData: number[];

    switch (interval) {
      case 'day':
        sortedLabels = labels.slice(0, -1);
        break;
      case 'week':
        sortedLabels = labels.slice(0, -1).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        break;
      case 'month':
        sortedLabels = labels.slice(0, -1).sort((a, b) => {
          const dateA = moment(a, 'YYYY-MM');
          const dateB = moment(b, 'YYYY-MM');
          return dateA.diff(dateB);
        });
        break;
      case 'year':
        sortedLabels = labels.slice().sort((a, b) => parseInt(a) - parseInt(b));
        break;
      default:
        sortedLabels = labels.slice();
        break;
    }

    // Rearrange data based on sorted labels
    sortedData = sortedLabels.map(label => {
      const index = labels.indexOf(label);
      return this.data[index];
    });

    return { labels: sortedLabels, data: sortedData };
  }

  // Helper function to get ISO week number
  getISOWeek(date: Date): number {
    return moment(date).isoWeek();
  }

  // Helper function to get week number
  getWeekNumber(date: any) {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart: any = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return [date.getUTCFullYear(), weekNo];
  }

  // Method to aggregate data and update chart labels and data
  aggregateData(groupedData: Map<string, number>): void {
    const sortedChartData = this.sortChartLabels(this.chartLabels, this.selectedInterval);
    this.chartLabels = sortedChartData.labels;
    this.data = sortedChartData.data;
    groupedData.forEach((value, key) => {
      this.chartLabels.push(key);
      this.data.push(value);
    });

    this.sortChartLabels(this.chartLabels, this.selectedInterval);
    this.createChart();
  }

  // Method to change the selected chart interval
  changeChartInterval(interval: string): void {
    this.selectedInterval = interval;
    this.updateChartData();
  }

}
