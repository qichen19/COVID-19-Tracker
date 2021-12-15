import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../../services/data-service.service';
import { GlobalDataSummary } from '../../models/global-data';
import {GoogleChartInterface, GoogleChartsControlInterface, RegionClickEvent} from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  totalConfirmed = 0;
  totalDeaths = 0;
  globalData: GlobalDataSummary[];
  columnchartDatatable = [];
  geochartDatatable = [];
  dynamicResize = false;
  currentDate = '';

  columnChart = {
    chartType: 'ColumnChart',
    height: 500,
    options: {
      title:'Countries with more than 8 million confirmed cases',
      backgroundColor: '#E4E4E4',
      legend: 'none',
      animation: {
        duration: 1000,
        easing: 'out',
        is3D: true
      },
      colors: ['#FF6F50']
    }
  }

  geoChart: GoogleChartInterface = {
    chartType: 'GeoChart',
    options: {
      height: 500,
      backgroundColor: '#9cf',
      datalessRegionColor: '#f8f9fa',
      defaultColor: '#6c757d',
      colorAxis: {colors: ['#ffbaba', '#ff7b7b', '#ff5252', '#ff0000',	'#a70000']},
      animation: {
        duration: 1000,
        easing: 'out',
        is3D: true
      }
    }
  };

  constructor(private dataService: DataServiceService) { }


  initChart(caseType: string) {
    this.columnchartDatatable = [];
    this.geochartDatatable = [];
    this.dynamicResize = true;
    
    this.globalData.forEach(cs => {
      if(cs.confirmed > 0)  {
        let value: number;
        if(caseType === 'c') {
          value = cs.confirmed;
        }
        if(caseType === 'd') {
          value = cs.deaths;
        }
        this.geochartDatatable.push([cs.country, value]);
      }

        if(cs.confirmed > 8000000)  {
          let value: number;
          if(caseType === 'c') {
            value = cs.confirmed;
          }
          if(caseType === 'd') {
            value = cs.deaths;
          }
          this.columnchartDatatable.push([cs.country, value]);
      }
    });

    //this.datatable = this.datatable.sort(function(a, b){return b-a}).slice(0,10);
  }

  updateChart(input: HTMLInputElement) {
    this.initChart(input.value);
  }


  ngOnInit(): void {
    this.dataService.getGlobalData()
    .subscribe(
      {
        next: (result) => {
          this.globalData = result;
          result.forEach (cs => {
            if(!Number.isNaN(cs.confirmed)) {
              this.totalDeaths += cs.deaths;
              this.totalConfirmed += cs.confirmed;
            }
          });
          this.initChart('c');
        }
      }
    );

    this.currentDate = this.dataService.getDate();
  }

}
