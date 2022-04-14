import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Label } from '@core/models/fee';
import { ConfigInitService } from '@init/config-init.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LabelService {
  private backendUrl: string;
  constructor(private http: HttpClient, private configService: ConfigInitService) {
    this.backendUrl = `${this.configService.getConfig()['BACKEND_URL']}`;
  }

  updateAll(list: Label[]): Observable<Label[]> {
    return this.http.post<Label[]>(`${this.backendUrl}/api/label/update-all`, list);
  }

  findAll(): Observable<Label[]> {
    return this.http.post<Label[]>(`${this.backendUrl}/api/label/find-all`, {});
  }
  findByName(name: string): Observable<Label> {
    return this.http.post<Label>(`${this.backendUrl}/api/label/find-by-name?name=${name}`, {});
  }
}
