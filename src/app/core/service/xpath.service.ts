import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class XPathService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigInitService,
  ) {
    this.baseUrl = `${configService.getConfig()['BACKEND_URL']}/api/toolbox/public/xpath`;
  }

  evaluate(expression: string, data: string): Observable<string> {
    let formData = new FormData();

    formData.append('expression', expression);
    formData.append('data', data);
    return this.http.post(`${this.baseUrl}/evaluate`, formData, {
      responseType: 'text',
    });
  }
}
