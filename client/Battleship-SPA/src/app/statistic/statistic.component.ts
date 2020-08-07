import { Component, OnInit, Input} from '@angular/core';
import { Record } from '../_models/statistic-record.model';
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
  sortName: number;
  sortMove: number;
  sortShipCount: number;
  sortState: number;

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
   this.sortName = 0;
   this.sortMove = 2;
   this.sortShipCount = 4;
   this.sortState = 0;
  }

  resetFilters() {
    this.name = "";
    this.filter = 0;
    this.onlyIntactShips = false;
    this.sortState = 0;
    this.loadRecords();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadRecords();
  }

  loadRecords() {
    this.statisticsService.GetAllRecords(this.pagination.currentPage, this.name, this.filter, this.onlyIntactShips, this.sortState)
    .subscribe((res: PaginatedResult<Record[]>) => {
     this.records = res.result;
     this.pagination = res.pagination;
   });
  }

  changeSortName() {
    this.sortName == 0 ? this.sortName = 1 :  this.sortName = 0;
    this.sortState = this.sortName;
    this.loadRecords();
  }

  changeSortMoveCount() {
    this.sortName == 2 ? this.sortName = 3 :  this.sortName = 2;
    this.sortState = this.sortMove;
    this.loadRecords();
  }

  changeSortShipCount() {
    this.sortName == 4 ? this.sortName = 5 :  this.sortName = 4;
    this.sortState = this.sortShipCount;
    this.loadRecords();
  }
  
}


