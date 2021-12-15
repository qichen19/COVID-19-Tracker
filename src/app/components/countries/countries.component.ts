import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../../services/data-service.service';
import { GlobalDataSummary } from '../../models/global-data';
import { TimeDataSummary } from '../../models/time-data';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[];
  countries: string[] = [];
  totalConfirmed = 0;
  totalDeaths = 0;
  selectedCountryData: TimeDataSummary[];
  selectedCountryDataRecentMonth: TimeDataSummary[];
  timeData;
  loading = true;
  linechartDatatable = [];
  columnchartDatatable = [];

  linechart = {
    chartType: 'LineChart',
    height: 500,
    options: {
      title: 'Number of Total Cases',
      legend: 'none',
      backgroundColor: '#E4E4E4',
      animation: {
        duration: 1000,
        easing: 'out',
        is3D: true
      },
      colors: ['#FF6F50']
    }
  }

  columnchart = {
    chartType: 'ColumnChart',
    height: 500,
    options: {
      title: 'Number of New Cases',
      legend: 'none',
      backgroundColor: '#E4E4E4',
      animation: {
        duration: 1000,
        easing: 'out',
        is3D: true
      },
      colors: ['#FF6F50']
    }
  }

  constructor(private service: DataServiceService) { }

  ngOnInit(): void {
    this.service.getTimeData()
    .subscribe(result => {
      this.timeData = result;
    });

    this.service.getGlobalData()
    .subscribe(result => {
      this.data = result;
      this.data.forEach(cs => {
        if(!Number.isNaN(cs.confirmed)) {
          this.countries.push(cs.country);
        }
      })
    });
    this.loading = false;
  }

  updateChart() {
    this.linechartDatatable = [];
    this.columnchartDatatable = [];
    this.selectedCountryData.forEach((cs, idx) => {
      this.linechartDatatable.push([cs.date, cs.cases]);
      if(idx == 0) {
        this.columnchartDatatable.push([cs.date, cs.cases]);
      } else {
        this.columnchartDatatable.push([cs.date, cs.cases - this.selectedCountryData[idx-1].cases]);
      }      
    })
  }

  updateChartRecent() {

    this.linechartDatatable = [];
    this.columnchartDatatable = [];
    this.selectedCountryDataRecentMonth.forEach((cs, idx) => {
      this.linechartDatatable.push([cs.date, cs.cases]);
      if(idx == 0) {
        this.columnchartDatatable.push([cs.date, cs.cases]);
      } else {
        this.columnchartDatatable.push([cs.date, cs.cases - this.selectedCountryData[idx-1].cases]);
      }      
    })

  }

  updateValues(country: string) {
    this.data.forEach(cs => {
      if(cs.country == country) {
        this.totalConfirmed = cs.confirmed;
        this.totalDeaths = cs.deaths;
      }
    })

    this.selectedCountryData = this.timeData[country];
    this.selectedCountryDataRecentMonth = this.selectedCountryData.slice(-30);
    console.log(this.selectedCountryData);
    this.updateChart();
  }

}
