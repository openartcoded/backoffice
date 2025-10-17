import { Component, OnDestroy, OnInit } from '@angular/core';
import { FinanceService } from '@core/service/finance.service';
import { PortfolioService } from '@core/service/portfolio.service';
import { Portfolio, Tick } from '@core/models/portfolio';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioFormComponent } from '../portfolio-form/portfolio-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, mergeMap, Subscription } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  standalone: false,
})
export class PortfolioComponent implements OnInit, OnDestroy {
  constructor(
    private financeService: FinanceService,
    private modalService: NgbModal,
    private router: Router,
    private portfolioService: PortfolioService,
  ) {}

  selectedTicks: any[];
  errors: any[];
  filteredTicks: any[];
  selectedPortfolio: Portfolio;
  loaded: boolean;
  portfolios: Portfolio[];
  subscriptions: Subscription[] = [];

  sortAsc: boolean;

  async ngOnInit() {
    await this.load();
  }

  async load(
    callback = () => {
      this.selectedPortfolio = this.portfolios?.find((p) => p?.principal);
    },
  ) {
    this.loaded = false;
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
    let subscription = this.portfolioService.findAll().subscribe(async (ps) => {
      this.portfolios = ps;
      callback();
      this.updateSelectedPorfolio();
      this.loaded = true;
    });
    this.subscriptions.push(subscription);
  }

  async openPortfolioModal(portfolio: Portfolio = { name: '' }) {
    const modalRef = this.modalService.open(PortfolioFormComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.portfolio = portfolio;
    modalRef.componentInstance.submitted.subscribe((portfolio) => {
      this.portfolioService.save(portfolio).subscribe((px) => {
        modalRef.close();
        this.load(() => (this.selectedPortfolio = this.portfolios.find((p) => p?.id === px?.id)));
      });
    });
  }

  async deletePortfolio(selectedPortfolio: Portfolio) {
    this.portfolioService.delete(selectedPortfolio).subscribe(async (p) => await this.load());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
  }

  private updateSelectedPorfolio() {
    if (this.selectedPortfolio) {
      this.filteredTicks = [];
      this.selectedTicks = [];
      this.errors = [];
      for (let tick of this.selectedPortfolio.ticks) {
        tick.loading = true;
        let s = this.financeService
          .chart(tick.symbol, '1d', '1d')
          .pipe(
            catchError((error) => {
              console.error('error while fetching tick from yahoo: ', error);
              this.errors.push({
                tick,
                error,
              });
              return EMPTY;
            }),
          )
          .subscribe((res) => {
            let q = res.chart.result[0];
            tick.currentPrice = q.meta.regularMarketPrice;
            tick.delta = ((tick.currentPrice - tick.priceWhenAdded) / tick.priceWhenAdded) * 100;
            tick.loading = false;
            this.filteredTicks.push(tick);
            this.selectedTicks.push(tick);
          });
        this.subscriptions.push(s);
      }
    }
  }

  onPortfolioChanged($event: Portfolio) {
    this.selectedPortfolio = $event;
    this.updateSelectedPorfolio();
  }

  navigateToTick(t: any) {
    this.router.navigateByUrl(`/finance/ticks?symbol=${t.symbol}`);
  }

  filter($event) {
    let search = $event.target.value;
    if (search.length < 2) {
      this.filteredTicks = this.selectedTicks;
    } else {
      let fsk = search.toUpperCase();
      this.filteredTicks = this.selectedTicks.filter((tick) => tick.symbol.toUpperCase().includes(fsk));
    }
  }

  sortByDelta() {
    this.filteredTicks = this.filteredTicks.sort((a, b) => {
      let first = this.sortAsc ? a : b;
      let second = this.sortAsc ? b : a;
      return first.delta > second.delta ? 1 : -1;
    });
    this.sortAsc = !this.sortAsc;
  }
  deleteTick(tick: Tick) {
    const selectedPortfolio = this.selectedPortfolio;
    this.subscriptions.push(
      this.portfolioService.deleteTick(selectedPortfolio.id, tick.symbol).subscribe((_) =>
        this.load(() => {
          this.selectedPortfolio = this.portfolios?.find((p) => p.id === selectedPortfolio.id);
        }),
      ),
    );
  }
}
