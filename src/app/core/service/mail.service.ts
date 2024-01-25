import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigInitService } from '@init/config-init.service';
import { MailJob, MailRequest } from '@core/models/mail';
import { Page } from '@core/models/page';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  basePath: string;

  constructor(
    private http: HttpClient,
    configService: ConfigInitService,
  ) {
    this.basePath = `${configService.getConfig()['BACKEND_URL']}/api/mail`;
  }

  send(data: MailRequest): Observable<void> {
    return this.http.post<void>(`${this.basePath}/send`, data);
  }

  findAll(pageNumber: number, pageSize: number): Observable<Page<MailJob>> {
    const url = `${this.basePath}/find-all?page=${pageNumber - 1}&size=${pageSize}&sort=creationDate,DESC`;
    return this.http.get<Page<MailJob>>(url);
  }
}
