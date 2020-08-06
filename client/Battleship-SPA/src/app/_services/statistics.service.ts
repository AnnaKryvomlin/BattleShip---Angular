import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Record } from '../_models/Record';
import { PaginatedResult } from '../_models/pagination.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  baseUrl = environment.apiUrl + 'Statistics';
  
constructor(private http: HttpClient) { }

GetAllRecords(page?, name?, filter?, onlyIntactShips?): Observable<PaginatedResult<Record[]>>
{
  const paginationResult: PaginatedResult<Record[]> = new PaginatedResult<Record[]>();
  let params = new HttpParams();
  if(page != null)
  {
    params = params.append('page', page);
  }
  
  if(name != null)
  {
    params = params.append('name', name);
  }

  if(filter != null)
  {
    params = params.append('filterMoveState', filter);
  }

  if(onlyIntactShips != null)
  {
    params = params.append('onlyIntactShips', onlyIntactShips);
  }

  return this.http.get<Record[]>(this.baseUrl, {observe: 'response', params})
  .pipe(
    map(response => {
      paginationResult.result = response.body;
      if(response.headers.get('Pagination') != null){
        paginationResult.pagination = JSON.parse(response.headers.get('Pagination'))
      }
      console.log(paginationResult);
      return paginationResult;
    }));
}
}
