import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable()
export class DashboardService {
  searchHistoryRef: any;
  transHistoryRef: any;
  base: string;
  suffix: string;
  searchQuery: string;
  transbase: string;
  transsuffix: string;
  transQuery: string;
  backbase: string;
  backsuffix: string;
  backQuery: string;
  adminRef: any;
  

  // searchHistory: Subject<string>;
  // history: string[];

  constructor(
    private loginService: LoginService,
    private db: AngularFireDatabase,
    private httpClient:HttpClient
    ) {
    this.searchHistoryRef = this.db.list(`currentSession/${this.loginService.userUid}/searches`);
    this.transHistoryRef = this.db.list(`currentSession/${this.loginService.userUid}/translations`)
  
    this.base = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=';
    this.suffix = '&origin=*&format=json';
    this.transbase = 'https://translation.googleapis.com/language/translate/v2?q=';
    this.transsuffix = `&target=fr&format=text&source=en&key=${environment.CSC436}`;
    this.backbase = 'https://translation.googleapis.com/language/translate/v2?q=';
    this.backsuffix = `&target=en&format=text&source=fr&key=${environment.CSC436}`;
  }

  searchwiki(searchText:string): Observable<any> {
    this.searchQuery = `${this.base}${searchText}${this.suffix}`;
    return this.httpClient.get(this.searchQuery);
  }

  transGoogle(text:string): Observable<any> {
    this.transQuery = `${this.transbase}${text}${this.transsuffix}`;
    return this.httpClient.get(this.transQuery);
  }

  backGoogle(text:string): Observable<any> {
    this.backQuery = `${this.backbase}${text}${this.backsuffix}`;
    return this.httpClient.get(this.backQuery);
  }

  recordSearch(searchT: string) {
    this.searchHistoryRef.push({sText:'User searched: '+searchT});
    console.log("Searched " + searchT);
  }

  getSearchHistory() {
    return this.searchHistoryRef.valueChanges();
  }

  recordTrans(originText:string) {
    this.transHistoryRef.push({transText: 'User performed translated the following sentence: '+originText});
    console.log("Translated "+originText);
  }

  getTransHistory() {
    return this.transHistoryRef.valueChanges();
  }

}
