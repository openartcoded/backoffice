import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigInitService } from '@init/config-init.service';
import { Sms } from '@core/models/sms';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  basePath: string;

  constructor(private http: HttpClient, configService: ConfigInitService) {
    this.basePath = `${configService.getConfig()['BACKEND_URL']}/api/sms`;
  }

  send(data: Sms): Observable<void> {
    return this.http.post<void>(this.basePath, data);
  }
}
