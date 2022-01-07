import {Component, OnInit} from '@angular/core';
import {SystemHealth} from "./interface/system-health";
import {SystemCpu} from "./interface/system-cpu";
import {DashboardService} from "./service/dashboard.service";
import {HttpErrorResponse} from "@angular/common/http";
import *  as Chart from "Chart.js"
import {ChartType} from "./enum/chart-type";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public traceList: any[] = []
  public selectedTrace: any
  // @ts-ignore
  public systemHealth: SystemHealth | any
  public systemCpu!: SystemCpu | any
  public processUptime: string | any
  public http200Traces: any[] = []
  public http400Traces: any[] = []
  public http404Traces: any[] = []
  public http500Traces: any[] = []
  public httpDefaultTraces: any[] = []
  public toggle: any = false
  public timestamp: number | any;

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit(): void {
    this.getTraces()
    this.getCpuUsage()
    this.getSystemHealth()
    this.getProcessUptime(true)
  }

// card response
  private getTraces(): void {
    this.dashboardService.getHttpTraces().subscribe(
      (response: any) => {
        console.log(response.traces)
        this.processTraces(response.traces)
        this.initializeBarChart()
        this.initializePieChart()
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

  // nav bar
  private getCpuUsage(): void {
    this.dashboardService.getSystemCpu().subscribe(
      (response: SystemCpu) => {
        console.log(response)
        this.systemCpu = response
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

   /** system Health*/
  private getSystemHealth(): void {
    this.dashboardService.getSystemHealth().subscribe(
      (response: SystemHealth) => {
        console.log(response)
        this.systemHealth = response
        this.systemHealth.components.diskSpace.details.free =
          this.formatBytes(this.systemHealth.components.diskSpace.details.free)
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

  /**  Refresh Databases*/
  public onRefreshData(): void {
    this.http200Traces = []
    this.http400Traces = []
    this.http404Traces = []
    this.http500Traces = []
    this.httpDefaultTraces = []
    this.getTraces()
    this.getCpuUsage()
    this.getSystemHealth()
    this.getProcessUptime(false)
  }

  // system Process time
  private getProcessUptime(isUpdateTime: boolean): void {
    this.dashboardService.getProcessUptime().subscribe(
      (response: any) => {
        console.log(response)
        this.timestamp = Math.round(response.measurements[0].value)
        this.processUptime = this.formateUptime(this.timestamp)
        if (isUpdateTime) {
          this.updateTime()
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

  // list requests & response
  private processTraces(traces: any): void {
    this.traceList = traces
    this.traceList.forEach(trace => {
      switch (trace.response.status) {
        case 200:
          this.http200Traces.push(trace)
          break
        case 400:
          this.http400Traces.push(trace)
          break
        case 404:
          this.http404Traces.push(trace)
          break
        case 500:
          this.http500Traces.push(trace)
          break
        default:
          this.httpDefaultTraces.push(trace)
      }
    })
  }

  /** Add Char js for table diagrams id-> << barChart >> */
  private initializeBarChart(): void {
    const barChartElement = document.getElementById('barChart')
    // @ts-ignore
    return new Chart(barChartElement, {
      type: ChartType.BAR,
      data: {
        labels: ['200', '404', '400', '500'],
        datasets: [{
          data: [this.http200Traces.length, this.http404Traces.length, this.http400Traces.length, this.http500Traces.length],
          backgroundColor: ['rgb(40, 167, 69)', 'rgb(0, 123, 255)', 'rgb(253, 126, 20)', 'rgb(220, 53, 69)'],
          borderColor: ['rgb(40, 167, 69)', 'rgb(0, 123, 255)', 'rgb(253, 126, 20)', 'rgb(220, 53, 69)'],
          borderWidth: 3
        }]
      },
      options: {
        title: {display: true, text: [`Last 100 Requests as of ${new Date()}`]},
        legend: {display: false},
        scales: {
          yAxes: [{ticks: {beginAtZero: true}}]
        }
      }
    })
  }

  /** Add Char js for table diagrams id-> << pieChart >> */

  private initializePieChart(): void {
    const pieChartElement = document.getElementById('pieChart')
    // @ts-ignore
    return new Chart(pieChartElement, {
      type: ChartType.PIE,
      data: {
        labels: ['200', '404', '400', '500'],
        datasets: [{
          data: [this.http200Traces.length, this.http404Traces.length, this.http400Traces.length, this.http500Traces.length],
          backgroundColor: ['rgb(40, 167, 69)', 'rgb(0, 123, 255)', 'rgb(253, 126, 20)', 'rgb(220, 53, 69)'],
          borderColor: ['rgb(40, 167, 69)', 'rgb(0, 123, 255)', 'rgb(253, 126, 20)', 'rgb(220, 53, 69)'],
          borderWidth: 3
        }]
      },
      options: {
        title: {display: true, text: [`Last 100 Requests as of ${new Date()}`]},
        legend: {display: true},
        display:true
      }
    })
  }


  public onSelectTrace(trace: any): void {
    this.selectedTrace = trace
    console.log(trace)
    // @ts-ignore
    document.getElementById('info-modal').click()
  }

  /** Converter in Bytes ,Tb, GB~ */
  private formatBytes(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes'
    }
    const k = 1024
    const dm = 2 < 0 ? 0 : 2
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  /** for formatting times*/
  private formateUptime(timestamp: number): string {
    const hours = Math.floor(timestamp / 60 / 60)
    const minutes = Math.floor(timestamp / 60) - (hours * 60)
    const seconds = timestamp % 60
    return hours.toString().padStart(2, '0') + 'h' +
      minutes.toString().padStart(2, '0') + 'm' + seconds.toString().padStart(2, '0') + 's'

  }

  /** Update time on page*/
  private updateTime(): void {
    setInterval(() => {
      this.processUptime = this.formateUptime(this.timestamp + 1)
      this.timestamp++
    }, 1000)
  }
}
