import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
//import { DashboardComponent } from './components/home-page/home-page.component';
import { GoalsComponent } from './components/goals/goals.component';
import { CaloriesComponent } from './components/calories/calories.component';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { HydrationComponent } from './components/hydration/hydration.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SchedulingComponent } from './components/scheduling/scheduling.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CostumSidenavComponent } from './components/costum-sidenav/costum-sidenav.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { LoadingComponent } from './components/loading/loading.component';
import { SleepTrackerComponent } from './components/sleep-tracker/sleep-tracker.component';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  {
    path: 'layout', canActivate: [authGuard], component: LayoutComponent, children: [
      { path: '', redirectTo: 'loading', pathMatch: 'full' },
      { path: 'loading', component: LoadingComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'goals', component: GoalsComponent },
      { path: 'calories', component: CaloriesComponent },
      { path: 'exercise', component: ExerciseComponent },
      { path: 'sleep-tracker', component: SleepTrackerComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'scheduling', component: SchedulingComponent },
      { path: 'settings', component: SettingsComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
