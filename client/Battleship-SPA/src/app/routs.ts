import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {FieldComponent} from './field/field.component';
import { AccountComponent } from './account/account.component';
import { GameComponent } from './game/game.component';
import { StatisticComponent } from './statistic/statistic.component';

export const appRoutes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'field', component: FieldComponent},
    {path: 'account', component: AccountComponent},
    {path: 'game/:id', component: GameComponent},
    {path: 'statistics', component: StatisticComponent},
    {path: '**', redirectTo: 'home', pathMatch: 'full'}
];