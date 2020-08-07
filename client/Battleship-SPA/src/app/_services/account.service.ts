import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Game } from '../_models/game.model';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

baseUrl = 'https://localhost:44336/api/PersonalAccount/';

constructor(private http: HttpClient) { }

getAllUserGames(): Observable<Game[]>
{
  return this.http.get<Game[]>(this.baseUrl);
}
}
