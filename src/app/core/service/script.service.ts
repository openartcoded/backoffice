import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigInitService } from '@init/config-init.service';
import { Script } from '@core/models/script';

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  constructor(
    private http: HttpClient,
    private configService: ConfigInitService,
  ) {}

  public getLoadedScripts(): Observable<Script[]> {
    return this.http.post<Script[]>(`${this.configService.getConfig()['BACKEND_URL']}/api/script`, {});
  }
}
