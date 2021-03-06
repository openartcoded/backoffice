import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { InvoiceService } from '@core/service/invoice.service';
import { Observable } from 'rxjs';
import { InvoiceSummary, Invoice, InvoicingType } from '@core/models/invoice';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { WindowRefService } from '@core/service/window.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit, OnDestroy {
  summary$: Observable<InvoiceSummary>;
  showGraphs = false;
  constructor(
    private invoiceService: InvoiceService,
    private windowService: WindowRefService,
    private breakPointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}
  ngOnDestroy(): void {
    this.summary$ = null;
    this.showGraphs = false;
  }

  ngOnInit(): void {
    this.load();
    setTimeout(() => (this.showGraphs = true), 200);
  }

  load() {
    const config = {
      responsive: true,
      displayModeBar: false,
    };
    const layout = (title: string, callback = (lyt) => {}) => {
      let l = {
        barmode: 'group',
        dragmode: 'zoom',
        showlegend: false,
        yaxis: {
          fixedrange: true,
          side: 'right',
          type: 'linear',
        },
        yaxis2: {
          fixedrange: true,
          overlaying: 'y',
          side: 'left',
        },
        xaxis: {
          fixedrange: true,
          rangeslider: {
            visible: false,
          },
        },
        //title: title,
      };
      callback(l);
      return l;
    };
    this.summary$ = this.invoiceService.findAll(true, false).pipe(
      map((invoices) => {
        const invoicesOrderedByDateAsc = invoices.sort(
          (a, b) =>
            DateUtils.toOptionalDate(a.dateOfInvoice).getTime() - DateUtils.toOptionalDate(b.dateOfInvoice).getTime()
        );

        const graphData = this.generateGraphData(invoicesOrderedByDateAsc);
        const average = {
          name: 'Earnings',
          x: graphData.map((d) => d.period),
          y: graphData.map((r) => r.subTotal),
          type: 'scatter',
          marker: { color: '#1f77b4' },
          yaxis: 'y2',
        };
        const amountWorked = {
          name: 'Working days',
          x: graphData.map((d) => d.period),
          y: graphData.map((g) => g.amount),
          marker: { color: '#b6b3c6' },
          type: 'bar',
        };
        const data = [average, amountWorked];
        const graphs = [{ data: data, config: config, layout: layout('Earnings/Working days') }];

        const invoicesThisYear = invoicesOrderedByDateAsc.filter((i) => i.invoiceTable?.some(this.filterByYear));
        return {
          graphs: graphs,
          totalInvoicesThisYear: invoicesOrderedByDateAsc.length,
          totalAmountOfWorkThisYear: invoicesThisYear
            .map(this.findAmount)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
          totalExclVatThisYear: invoicesThisYear
            .map((i) => i.subTotal)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
          numberOfInvoicesThisYear: invoicesThisYear.length,
          totalAmountOfWork: invoicesOrderedByDateAsc
            .map(this.findAmount)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
          totalExclVat: invoicesOrderedByDateAsc
            .map((i) => i.subTotal)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
        };
      })
    );
  }

  toggleGraphs() {
    this.showGraphs = !this.showGraphs;
  }

  isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  resize() {
    const isDesktop = this.breakPointObserver.isMatched('(min-width: 768px)');
    if (this.isBrowser() && !isDesktop) {
      this.windowService.nativeWindow.dispatchEvent(new Event('resize'));
    }
  }

  findPeriod(invoice) {
    return invoice?.invoiceTable?.find((t) => t.period?.length)?.period;
  }

  findAmount(invoice) {
    const it = invoice.invoiceTable?.find((i) => i.amount > 0);
    if (it?.amount) {
      switch (it.amountType) {
        case 'HOURS':
          return it.amount / it.hoursPerDay;
        default:
          return it.amount;
      }
    }
    return 0;
  }

  filterByYear(invoice) {
    let currentYear = DateUtils.getCurrentYear().toString();
    const year = invoice.period?.split('/')[1];
    return year === currentYear;
  }

  generateGraphData(invoicesOrderedByDateAsc: Invoice[]): GraphData[] {
    const graphInvoices = invoicesOrderedByDateAsc
      .map((invoice) => {
        return {
          dateOfInvoice: invoice.dateOfInvoice,
          period: this.findPeriod(invoice),
          subTotal: invoice.subTotal,
          amount: this.findAmount(invoice),
        };
      })
      .reduce((entryMap, e) => entryMap.set(e.period, [...(entryMap.get(e.period) || []), e]), new Map());
    const sortedAggregateData = Array.from(graphInvoices.values()).sort(
      (a, b) => new Date(a.dateOfInvoice).getTime() - new Date(b.dateOfInvoice).getTime()
    );
    return sortedAggregateData.map((v) =>
      v.reduce((previousValue, newValue) => {
        return {
          period: newValue.period,
          subTotal: (previousValue?.subTotal || 0) + (newValue?.subTotal || 0),
          amount: (previousValue?.amount || 0) + (newValue?.amount || 0),
        } as GraphData;
      }, {})
    );
  }
}

interface GraphData {
  period?: string;
  subTotal?: number;
  amount?: number;
}
