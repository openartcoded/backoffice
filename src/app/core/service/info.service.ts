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
  baseUrl = '';
  constructor(
    private http: HttpClient,
    private configService: ConfigInitService,
  ) {
    this.baseUrl = this.configService.getConfig()['BACKEND_URL'];
  }

  public getBuildInfo(): Observable<BackendInfo> {
    return this.http.get<BackendInfo>(`${this.baseUrl}/api/actuator/info`);
  }

  public getHealth(): Observable<HealthIndicator> {
    return this.http.get<HealthIndicator>(`${this.baseUrl}/api/actuator/health`);
  }

  public getLogs(): Observable<string> {
    return this.http.get(`${this.baseUrl}/api/actuator/logfile`, {
      responseType: 'text',
    });
  }
}
