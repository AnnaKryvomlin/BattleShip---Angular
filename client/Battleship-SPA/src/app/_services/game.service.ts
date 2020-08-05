import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from "@angular/common/http";
import { AuthService } from './auth.service';
import { environment } from "../../environments/environment";
import { Observable } from 'rxjs';
import { Coordinate } from '../_models/Coordinate';

@Injectable({
  providedIn: 'root'
})

export class GameService {

baseUrl = environment.apiUrl + 'Game/';

constructor(private http: HttpClient, private authService: AuthService) { }

createGame(ships: any[])
{
   console.log(ships);
   return this.http.post(this.baseUrl + 'create_game', ships );
}

findGame(ships: any[])
{
  console.log(ships);
  return this.http.post(this.baseUrl + 'find_game', ships );
}

getUserCoords(id: number): Observable<Coordinate[]>
{
  return this.http.get<Coordinate[]>(this.baseUrl + 'my_coords/' + id);
}

getEnemyCoords(id: number): Observable<Coordinate[]>
{
  return this.http.get<Coordinate[]>(this.baseUrl + 'enemy_coords/' + id);
}

getCuurentplayerId(id: number): Observable<number>
{
  return this.http.get<number>(this.baseUrl + 'get_current_player/' + id);
}

}
