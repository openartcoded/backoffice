import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Dossier, DossierSummary } from '../models/dossier';
import { Injectable } from '@angular/core';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  constructor(
    private configService: ConfigInitService,
    private http: HttpClient,
  ) {}

  findAll(): Observable<string[]> {
    return this.http.post<string[]>(`${this.configService.getConfig()['BACKEND_URL']}/api/cache/find-all`, {});
  }

  clear(cacheName: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/cache/clear?name=${cacheName}`,
      {},
    );
  }
}
