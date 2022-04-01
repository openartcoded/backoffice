import { Component, OnInit } from '@angular/core';
import { BackendInfo } from '@core/models/backend.info';
import { HealthIndicator } from '@core/models/health.indicator';
import { InfoService } from '@core/service/info.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-actuator',
  templateUrl: './actuator.component.html',
  styleUrls: ['./actuator.component.scss'],
})
export class ActuatorComponent implements OnInit {
  buildInfo$: Observable<BackendInfo>;
  healthIndicator$: Observable<HealthIndicator>;
  logs$: Observable<any>;
  constructor(private infoService: InfoService) {}

  ngOnInit(): void {
    this.buildInfo$ = this.infoService.getBuildInfo();
    this.healthIndicator$ = this.infoService.getHealth();
    this.logs$ = this.infoService.getLogs();
  }
}
