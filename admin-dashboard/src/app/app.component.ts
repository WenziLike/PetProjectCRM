import {Component, OnInit} from '@angular/core';
import {SystemHealth} from "./interface/system-health";
import {SystemCpu} from "./interface/system-cpu";
import {DashboardService} from "./service/dashboard.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public traceList: any[] = []
  public selectedTrace: any
  public systemHealth: SystemHealth | undefined
  public systemCpu: SystemCpu | undefined
  public processUptime: string | undefined
  public http200Traces: any[] = []
  public http400Traces: any[] = []
  public http404Traces: any[] = []
  public http500Traces: any[] = []
  public httpDefaultTraces: any[] = []
  public toggle: any = false

  constructor(private dashboardService: DashboardService) {
  }

  private getTraces(): void {
    this.dashboardService.getHttpTraces().subscribe(
      (response: any) => {
        console.log(response.traces)
        this.processTraces(response.traces)
      }
    )
  }

  ngOnInit(): void {
    this.getTraces()
  }

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

  public onSelectTrace(trace: any): void {
    // @ts-ignore
    document.getElementById('info-modal').click()
  }
}
