import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';

import {GameService} from './_services/game.service';
import { AlertifyService } from './_services/alertify.service';
import {AccountService} from './_services/account.service';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FieldComponent } from './field/field.component';
import { HomeComponent } from './home/home.component';

import {appRoutes} from './routs';
import { AuthService } from './_services/auth.service';
import { AuthIntercepterProvider } from './iterceptors/auth.intercepter';
import { AccountComponent } from './account/account.component';
import { GameComponent } from './game/game.component';
import { StatisticComponent } from './statistic/statistic.component';


@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      FieldComponent,
      HomeComponent,
      AccountComponent,
      GameComponent,
      StatisticComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      CommonModule,
      FormsModule,
      DragDropModule,
      RouterModule.forRoot(appRoutes)
   ],
   providers: [
      AlertifyService,
      GameService,
      AuthService,
      AuthIntercepterProvider,
      AccountService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
