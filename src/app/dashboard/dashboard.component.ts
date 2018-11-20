import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of} from 'rxjs'; 
import { stringify } from '@angular/core/src/util';
import 'rxjs/Rx';

declare let gtag:any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  searchText: string;
  searchList: string[];
  transList: string;
  wordList: string;
  originText: string;
  transText: string[];
  backWord: string;
  backText:string[];

  searches: any[];
  firstNamesRef: Observable<any>;
  firstName: string;
  lastName: string;
  nameExists: boolean;

  constructor(private dashboardService: DashboardService,
    private db: AngularFireDatabase) {
    this.searches = [];
    this.transText = [];
    this.backText = [];
  }

  searchWiki(searchText:string) {
    console.log("App searching " + searchText + " ...");
    console.log(this.dashboardService.searchwiki(this.searchText));
    this.dashboardService.recordSearch(this.searchText);
    this.dashboardService.searchwiki(this.searchText)
    .map(
      (value)=>{
        console.log("VALUE VALUE VALUE")
        console.log(value)
        console.log("VALUE VALUE VALUE")
        return value['query']['search'];
      }
    )
    .subscribe(
      (value) => {
        console.log(value);
        this.searchList = value;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  translation(value:string) {
      console.log("APP Translating..." + value);
      console.log(this.dashboardService.transGoogle(value));
      this.addHistory(value);
      this.dashboardService.recordTrans(value);
      this.originText = value;
      console.log("Sending gtag event for translate button clicked.");
      gtag('event', 'User clicked Translate button.', {
        'send_to': 'UA-129492302-1'
      });
      console.log("Sended gtag event for translate button clicked.");
      this.dashboardService.transGoogle(value).subscribe(
        result => {
          console.log(result);
          this.transList = result['data']['translations'][0]['translatedText'];
          this.transText.push(this.transList);
          console.log(this.transList);
        },
        (error) => {
          console.log(error);
        }
      )
      console.log(this.transText);
  }

  addHistory(originText:string) {
    this.db.list('history').set("User performed translated the following sentence "+originText, true);// value is always "true" for first-name in database
    console.log(originText + 'added successfully.');
  }
  translateWord() {
    this.transList.split(' ').forEach(
      value=> {
        console.log('WORD WORD WORD');
        console.log(value);
        this.dashboardService.backGoogle(value).subscribe(
          result => {
            console.log("BACK BACK BACK");
            this.backWord = result['data']['translations'][0]['translatedText'];
            this.backText.push(this.backWord);
          }
        )
      }
    ) 
  }

  clearback() {
    this.backWord = '';
    this.backText = [];
  }

  searchHistory() {
    this.dashboardService.getSearchHistory().subscribe( (history: any) => {
      this.searches = history;
    });
  }

  ngOnInit() {

  }

}
