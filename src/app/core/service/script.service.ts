import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigInitService } from '@init/config-init.service';
import { Script } from '@core/models/script';

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  baseUrl: string;
  constructor(
    private http: HttpClient,
    private configService: ConfigInitService,
  ) {
    this.baseUrl = `${this.configService.getConfig()['BACKEND_URL']}`;
  }

  public getLoadedScripts(): Observable<Script[]> {
    return this.http.post<Script[]>(`${this.baseUrl}/api/script`, {});
  }

  public getBindingsMeta(): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(`${this.baseUrl}/api/script/bindings`, {});
  }
  public run(script: string): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/api/script/run`,
      { script },
      {
        responseType: 'text',
      },
    );
  }
}
