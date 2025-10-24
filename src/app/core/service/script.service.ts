import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ConfigInitService } from '@init/config-init.service';
import { Script, UserScript } from '@core/models/script';

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

  public getUserScripts(): Observable<UserScript[]> {
    return this.http.get<UserScript[]>(`${this.baseUrl}/api/script/user-script`);
  }

  public saveUserScripts(us: UserScript): Observable<UserScript> {
    return this.http.post<UserScript>(`${this.baseUrl}/api/script/user-script`, us);
  }

  public deleteUserScripts(us: UserScript): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/script/user-script?id=${us.id}`);
  }

  public run(script?: string): Observable<string> {
    if (!script?.length) {
      return throwError(() => new Error('script is empty'));
    }
    return this.http.post(
      `${this.baseUrl}/api/script/run`,
      { script },
      {
        responseType: 'text',
      },
    );
  }
}
