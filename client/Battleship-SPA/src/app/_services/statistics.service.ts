import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Record } from '../_models/Record';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  baseUrl = environment.apiUrl + 'Statistics';
  
constructor(private http: HttpClient) { }

GetAllRecords(): Observable<Record[]>
{
  return this.http.get<Record[]>(this.baseUrl);
}
}
