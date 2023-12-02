import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/auth.service';
import { AuthComponent } from './components/auth/auth.component';
import { AppComponent } from './app.component';
import { CostumSidenavComponent } from './components/costum-sidenav/costum-sidenav.component';
import { GoalsComponent } from './components/goals/goals.component';
import { CaloriesComponent } from './components/calories/calories.component';
import { HydrationComponent } from './components/hydration/hydration.component';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { SchedulingComponent } from './components/scheduling/scheduling.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from './material/material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { RightSidenavComponent } from './components/right-sidenav/right-sidenav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    CostumSidenavComponent,
    GoalsComponent,
    CaloriesComponent,
    HydrationComponent,
    ExerciseComponent,
    SchedulingComponent,
    ReportsComponent,
    SettingsComponent,
    LayoutComponent,
    DashboardComponent,
    RightSidenavComponent,



  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MaterialModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    MatMenuModule,
    MatGridListModule,
    MatCardModule,




  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
