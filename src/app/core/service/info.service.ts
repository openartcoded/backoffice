import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendInfo } from '@core/models/backend.info';
import { HealthIndicator } from '@core/models/health.indicator';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  constructor(
    private http: HttpClient,
    private configService: ConfigInitService,
  ) {}

  public getBuildInfo(): Observable<BackendInfo> {
    return this.http.get<BackendInfo>(`${this.configService.getConfig()['BACKEND_URL']}/api/actuator/info`);
  }

  public getHealth(): Observable<HealthIndicator> {
    return this.http.get<HealthIndicator>(`${this.configService.getConfig()['BACKEND_URL']}/api/actuator/health`);
  }

  /**
   * @deprecated disabled in the backend
   */
  public getLogs(): Observable<any> {
    return this.http.get(`${this.configService.getConfig()['BACKEND_URL']}/api/actuator/logfile`, {
      responseType: 'text',
    });
  }
}
