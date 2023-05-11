import { Component, OnInit } from '@angular/core';
import { BackendInfo } from '@core/models/backend.info';
import { HealthIndicator } from '@core/models/health.indicator';
import { InfoService } from '@core/service/info.service';
import { combineLatest, map, Observable } from 'rxjs';

type Indicators = { buildInfo: BackendInfo, healthIndicator: HealthIndicator };
@Component({
  selector: 'app-actuator',
  templateUrl: './actuator.component.html',
  styleUrls: ['./actuator.component.scss'],
})
export class ActuatorComponent implements OnInit {
  indicators$: Observable<Indicators>;

  // logs$: Observable<any>;
  constructor(private infoService: InfoService) { }

  ngOnInit(): void {
    this.indicators$ = combineLatest([this.infoService.getBuildInfo(), this.infoService.getHealth()])
      .pipe(map(([buildInfo, healthIndicator]) => ({ buildInfo, healthIndicator })));
    // this.logs$ = this.infoService.getLogs();
  }
}
