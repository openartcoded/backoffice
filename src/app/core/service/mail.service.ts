import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigInitService } from '@init/config-init.service';
import { MailRequest } from '@core/models/mail-request';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  basePath: string;

  constructor(private http: HttpClient, configService: ConfigInitService) {
    this.basePath = `${configService.getConfig()['BACKEND_URL']}/api/mail`;
  }

  send(data: MailRequest): Observable<void> {
    return this.http.post<void>(`${this.basePath}/send`, data);
  }
}
