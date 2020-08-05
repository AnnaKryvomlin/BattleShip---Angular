import { Component, OnInit } from '@angular/core';
import { Record } from '../_models/Record';
import {StatisticsService} from '../_services/statistics.service'
@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {

  records: Record[] = [];
  constructor(private statisticsRecord: StatisticsService) { }

  ngOnInit() {
    this.statisticsRecord.GetAllRecords()
    .subscribe(data => {
     this.records = data});
  }

}
