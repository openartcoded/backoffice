import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionMetadata, ActionResult, ReminderTask } from '@core/models/reminder-task';
import { ConfigInitService } from '@init/config-init.service';
import { Page } from '@core/models/page';

@Injectable({
  providedIn: 'root',
})
export class ReminderTaskService {
  basePath: string;

  constructor(private http: HttpClient, configService: ConfigInitService) {
    this.basePath = `${configService.getConfig()['BACKEND_URL']}/api/reminder-task`;
  }

  public findAll(): Observable<ReminderTask[]> {
    return this.http.get<ReminderTask[]>(this.basePath + '/find-all');
  }

  public allowedActions(): Observable<ActionMetadata[]> {
    return this.http.get<ActionMetadata[]>(this.basePath + '/allowed-actions');
  }

  public actionResults(actionKey: string, pageNumber: number, pageSize: number): Observable<Page<ActionResult>> {
    return this.http.get<Page<ActionResult>>(
      `${this.basePath}/action-results?key=${actionKey}&page=${pageNumber - 1}&size=${pageSize}`
    );
  }

  public findById(id: string): Observable<ReminderTask> {
    return this.http.get<ReminderTask>(this.basePath + '/find-by-id?id=' + id);
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(this.basePath + '?id=' + id);
  }

  public save(reminderTask: ReminderTask): Observable<void> {
    return this.http.post<void>(this.basePath + '/save', reminderTask);
  }

  public validateCronExpression(cronExpression: string): Observable<{ valid: boolean }> {
    return this.http.get<{ valid: boolean }>(
      this.basePath + '/validate-cron-expression?cronExpression=' + cronExpression
    );
  }
}
