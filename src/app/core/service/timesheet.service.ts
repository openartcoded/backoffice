import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Timesheet, TimesheetPeriod, TimesheetSettings, TimesheetSettingsForm } from '@core/models/timesheet';
import { RawResponse } from '@core/models/raw-response';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  basePath: string;

  constructor(private http: HttpClient, private configService: ConfigInitService) {
    this.basePath = `${this.configService.getConfig()['BACKEND_URL']}/api/timesheet`;
  }

  public findAllGroupedByYearAndClientName(): Observable<Map<number, Map<String, Timesheet[]>>> {
    return this.http.get<Map<number, Map<String, Timesheet[]>>>(this.basePath);
  }

  public count(): Observable<RawResponse> {
    return this.http.get<RawResponse>(this.basePath + '/count');
  }

  public saveOrUpdate(timesheet: Timesheet): Observable<Timesheet> {
    return this.http.post<Timesheet>(this.basePath, timesheet);
  }

  public saveOrUpdatePeriod(timesheetId: string, period: TimesheetPeriod): Observable<TimesheetPeriod> {
    return this.http.post<TimesheetPeriod>(this.basePath + '/save-period?id=' + timesheetId, period);
  }

  public closeTimesheet(timesheetId: string): Observable<void> {
    return this.http.post<void>(this.basePath + '/close?id=' + timesheetId, {});
  }

  public reopenTimesheet(timesheetId: string): Observable<void> {
    return this.http.post<void>(this.basePath + '/reopen?id=' + timesheetId, {});
  }

  public updateSettings(settings: TimesheetSettingsForm): Observable<TimesheetSettings> {
    return this.http.post<TimesheetSettings>(this.basePath + '/settings', settings);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.basePath}?id=${id}`);
  }

  findById(id: string): Observable<Timesheet> {
    return this.http.get<Timesheet>(this.basePath + '/by-id?id=' + id);
  }
}
