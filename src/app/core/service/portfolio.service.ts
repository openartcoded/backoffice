import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Portfolio, Tick } from '../models/portfolio';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigInitService,
  ) {
    this.baseUrl = configService.getConfig()['BACKEND_URL'] + '/api/finance/portfolio';
  }

  delete(portfolio: Portfolio) {
    return this.http.delete<void>(`${this.baseUrl}?id=${portfolio.id}`, {});
  }

  findById(id: string): Observable<Portfolio> {
    return this.http.post<Portfolio>(`${this.baseUrl}/find-by-id?id=${id}`, {});
  }

  findAll(): Observable<Portfolio[]> {
    return this.http.post<Portfolio[]>(`${this.baseUrl}/find-all`, {});
  }

  updateTicks(portfolioId: string, ticks: Tick[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/update-ticks?id=${portfolioId}`, ticks);
  }

  deleteTick(portfolioId: string, symbol: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tick?id=${portfolioId}&symbol=${symbol}`, {});
  }

  save(portfolio: Portfolio): Observable<Portfolio> {
    return this.http.post<Portfolio>(`${this.baseUrl}/save`, portfolio);
  }
}
