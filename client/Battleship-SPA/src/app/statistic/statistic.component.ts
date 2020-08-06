import { Component, OnInit, Input} from '@angular/core';
import { Record } from '../_models/Record';
import {StatisticsService} from '../_services/statistics.service';
import { Pagination, PaginatedResult } from '../_models/pagination.model';
import { filter } from 'rxjs/operators';
import { allowedNodeEnvironmentFlags } from 'process';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {

  onlyIntactShips: boolean;
  pagination: Pagination;
  page: number = 1;
  records: Record[] = [];
  name: string;
  filterList = [{value: 0, display: "All"},
  {value: 1, display: "less then 40"},
  {value: 2, display: "41-100"},
  {value: 3, display: "more than 100"}];
  filter: number;

  constructor(private statisticsService: StatisticsService) { }

  ngOnInit() {
    
    this.statisticsService.GetAllRecords(this.page)
    .subscribe(data => {
     this.records = data.result;
     this.pagination = data.pagination;
   });

   this.name = "";
   this.filter = 0;
   this.onlyIntactShips = false;
  }

  resetFilters() {
    this.name = "";
    this.filter = 0;
    this.onlyIntactShips = false;
    this.loadRecords();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadRecords();
  }

  loadRecords() {
    console.log(this.filter);
    this.statisticsService.GetAllRecords(this.pagination.currentPage, this.name, this.filter, this.onlyIntactShips)
    .subscribe((res: PaginatedResult<Record[]>) => {
     this.records = res.result;
     this.pagination = res.pagination;
   });
  }
  
}


