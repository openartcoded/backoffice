import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MemoDate } from '@core/models/memo-date';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class MemoDateService {
  constructor(private http: HttpClient, private configService: ConfigInitService) {}

  findAll(): Observable<MemoDate[]> {
    return this.http.post<MemoDate[]>(`${this.configService.getConfig()['BACKEND_URL']}/api/memo-date`, {});
  }

  save(memoDate: MemoDate): Observable<MemoDate> {
    return this.http.post<MemoDate>(`${this.configService.getConfig()['BACKEND_URL']}/api/memo-date/save`, memoDate);
  }

  delete(memoDate: MemoDate) {
    return this.http.delete<any>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/memo-date?id=${memoDate.id}`,
      {}
    );
  }
}
