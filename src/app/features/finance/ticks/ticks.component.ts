import { Component, OnInit } from '@angular/core';
import { FinanceService } from '@core/service/finance.service';
import moment from 'moment';
import { Portfolio, Tick } from '@core/models/portfolio';
import { PortfolioService } from '@core/service/portfolio.service';
import { ActivatedRoute } from '@angular/router';

export interface QuoteResult {
  explains: any[];
  count: number;
  quotes: any[];
  news?: any[];
}

@Component({
  selector: 'app-ticks',
  templateUrl: './ticks.component.html',
  styleUrls: ['./ticks.component.scss'],
  standalone: false,
})
export class TicksComponent implements OnInit {
  detailUrl: string = 'https://finance.yahoo.com/quote/';
  result: QuoteResult;
  selectedQuote: any;
  selectedQuoteBasicInfo: any;
  selectedPortfolio: Portfolio;
  portfolios: Portfolio[];
  searchInput: string;
  loaded: boolean;

  constructor(
    private financeService: FinanceService,
    private activeRoute: ActivatedRoute,
    private portfolioService: PortfolioService,
  ) {}

  ngOnInit(): void {
    this.loadPortFolio();
    this.activeRoute.queryParams.subscribe((params) => {
      this.searchInput = params.symbol;
      this.search(null, () => {
        let q = this.result.quotes.find((q) => q.symbol === this.searchInput);
        this.detail(null, q);
      });
    });
  }

  search($event?: any, callback = () => {}) {
    this.selectedQuote = null;
    this.result = null;
    if (this.searchInput?.length >= 2) {
      this.financeService.search(this.searchInput).subscribe((res) => {
        this.result = res;
        callback();
      });
    } else {
      this.loaded = true;
    }
  }

  loadPortFolio(
    callback = () => {
      this.selectedPortfolio = this.portfolios?.find((p) => p !== null);
    },
  ): void {
    this.portfolioService.findAll().subscribe((ps) => {
      this.portfolios = ps;
      callback();
    });
  }

  detail($event: any, q: any, callback = () => {}) {
    this.selectedQuote = null;
    this.loaded = false;
    this.financeService.chart(q.symbol, '1m', '60m').subscribe((dt) => {
      this.selectedQuoteBasicInfo = q;
      this.result = null;
      this.selectedQuote = dt.chart.result[0];
      callback();
      this.loaded = true;
    });
  }

  refresh($event: any, callback = () => {}) {
    this.detail($event, this.selectedQuoteBasicInfo, callback);
  }

  getLabels(timestamp: number[]) {
    return timestamp?.map((date) => moment.unix(date).format('HH:mm'));
  }

  calcDelta() {
    let regularMarketPrice: number = this.selectedQuote.meta.regularMarketPrice;
    let previousClose = this.selectedQuote.meta.previousClose;
    let delta = regularMarketPrice - previousClose;
    return {
      delta: delta,
      percentage: (delta / previousClose) * 100,
    };
  }

  canAddToPortfolio() {
    return (
      this.selectedPortfolio &&
      !this.selectedPortfolio?.ticks?.find((t) => t.symbol === this.selectedQuoteBasicInfo.symbol)
    );
  }

  addToPortfolio($event) {
    this.updatePortfolioTicks($event, [
      ...(this.selectedPortfolio.ticks || []),
      ...[
        {
          symbol: this.selectedQuoteBasicInfo.symbol,
          currency: this.selectedQuote.meta.currency,
          priceWhenAdded: this.selectedQuote.meta.regularMarketPrice,
        },
      ],
    ]);
  }

  private updatePortfolioTicks($event, ticks: Tick[]) {
    this.refresh($event, () => {
      this.portfolioService.updateTicks(this.selectedPortfolio.id, ticks).subscribe((dt) => {
        this.loadPortFolio(() => {
          this.selectedPortfolio = this.portfolios.find((p) => this.selectedPortfolio.id === p.id);
        });
      });
    });
  }

  removeFromPortfolio($event: MouseEvent) {
    this.updatePortfolioTicks(
      $event,
      (this.selectedPortfolio.ticks || []).filter((t) => t.symbol !== this.selectedQuoteBasicInfo.symbol),
    );
  }
}
