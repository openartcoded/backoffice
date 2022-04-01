import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  constructor(private http: HttpClient, private configService: ConfigInitService) {}

  chart(tick: string, interval: string = '1d', range: string = '5d'): Observable<any> {
    let url = `${
      this.configService.getConfig()['BACKEND_URL']
    }/proxy/yahoo-finance/chart/${tick}?interval=${interval}&range=${range}&region=EU`;
    return this.http.get(url, {});
  }

  search(expression: string): Observable<any> {
    let url = `${this.configService.getConfig()['BACKEND_URL']}/proxy/yahoo-finance/search?q=${expression}`;
    return this.http.get<any>(url, {});
  }
}
