import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  searches: any[];
  trans: any[];
  constructor(private dashboardService: DashboardService) { 
    this.searchHistory();
    this.transHistory();
  }

  searchHistory() {
    this.dashboardService.getSearchHistory().subscribe( (sHistory: any) => {
      this.searches = sHistory;
    })
  }

  transHistory() {
    this.dashboardService.getTransHistory().subscribe( (tHistory: any) => {
      this.trans = tHistory;
    })
  }

  ngOnInit() {
  }

}
