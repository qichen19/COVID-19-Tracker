import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalDataSummary } from '../models/global-data';
import { TimeDataSummary } from '../models/time-data';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private currentDate = new Date();
  private prevDate = this.currentDate.setDate(this.currentDate.getDate() - 1);
  private prevDateFormat = formatDate(this.prevDate, 'MM-dd-yyyy', 'en-US');

  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/'+this.prevDateFormat+'.csv';
  private timeDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  constructor(private http: HttpClient) { }

  getDate() {
    return this.prevDateFormat;
  }

  getTimeData() {
    return this.http.get(this.timeDataUrl, {responseType: 'text'})
    .pipe(map(result => {
      let rows = result.split('\n');
      let mainData = {};
      let header = rows[0];
      let dates = header.split(/,(?=\S)/);
      dates.splice(0,4);
      rows.splice(0,1);

      rows.forEach(row => {
        let cols = row.split(/,(?=\S)/);
        let country = cols[1];
        cols.splice(0,4);
        //console.log(country, cols);
        mainData[country] = [];
        cols.forEach((value, index) => {
          let timeData : TimeDataSummary = {
            cases: +value,
            country: country,
            date: new Date(Date.parse(dates[index]))
          };
          mainData[country].push(timeData);
        })
      })

      //console.log(mainData);
      return mainData;
    }));
  }

  getGlobalData() {
    console.log(this.globalDataUrl);
    return this.http.get(this.globalDataUrl, {responseType: 'text'}).
    pipe(map(result => {
      let data : GlobalDataSummary[] = [];
      let raw = {};
      let rows = result.split('\n');
      rows.forEach(row => {
        let cols = row.split(/,(?=\S)/);
        let cs = {
          country: cols[3],
          confirmed: +cols[7],
          deaths: +cols[8],
        };
        let temp : GlobalDataSummary = raw[cs.country];
        if(temp) {
          temp.confirmed += cs.confirmed;
          temp.deaths += cs.deaths;
          raw[cs.country] = temp;
        } else {
          raw[cs.country] = cs;
        }
      });
  
      return <GlobalDataSummary[]>Object.values(raw);
      })
    )
  }
}
