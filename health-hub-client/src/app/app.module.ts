import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthComponent } from './components/auth/auth.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from './material/material.module';
import { AuthService } from './services/auth.service';
import { HomePageComponent } from './components/home-page/home-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CostumSidenavComponent } from './components/costum-sidenav/costum-sidenav.component';
import {MatListModule} from '@angular/material/list';
//import { DashboardComponent } from './components/home-page/home-page.component';
import { GoalsComponent } from './components/goals/goals.component';
import { CaloriesComponent } from './components/calories/calories.component';
import { HydrationComponent } from './components/hydration/hydration.component';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { SchedulingComponent } from './components/scheduling/scheduling.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';








@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomePageComponent,
    CostumSidenavComponent,
    //DashboardComponent,
    GoalsComponent,
    CaloriesComponent,
    HydrationComponent,
    ExerciseComponent,
    SchedulingComponent,
    ReportsComponent,
    SettingsComponent,
    LayoutComponent,
  
   
    
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
    RouterModule
    
    
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
