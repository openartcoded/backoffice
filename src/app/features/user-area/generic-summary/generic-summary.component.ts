import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { InvoiceService } from '@core/service/invoice.service';
import { Observable, Subscription, of } from 'rxjs';
import { InvoiceSummary, BackendInvoiceSummary } from '@core/models/invoice';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { DateUtils } from '@core/utils/date-utils';
import { WindowRefService } from '@core/service/window.service';

@Component({
  selector: 'app-generic-summary',
  templateUrl: './generic-summary.component.html',
  styleUrls: ['./generic-summary.component.scss'],
})
export class GenericSummaryComponent implements OnInit, OnDestroy {
  summary: InvoiceSummary;
  subscriptions: Subscription[];
  graphsPerClient$: Observable<any[]>;
  _selectedYear?: number = null;
  active = 1;
  loaded = true;
  constructor(
    private windowService: WindowRefService,
    private invoiceService: InvoiceService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((elt: Subscription) => {
      elt.unsubscribe();
    });
    this.summary = null;
  }

  ngOnInit(): void {
    this.subscriptions = [];
    this.load();
  }
  get selectedYear() {
    const currentYear = this._selectedYear || DateUtils.getCurrentYear();
    if ([...this.summary.invoicesGroupByYear.keys()].includes(currentYear)) {
      return currentYear;
    } else {
      return currentYear - 1;
    }
  }
  set selectedYear(year: number) {
    this._selectedYear = year;
  }

  resize(activeItem: number) {
    if (this.isBrowser() && (activeItem === 1 || activeItem === 3 || activeItem === 4 || activeItem === 5)) {
      this.loaded = false;
      let timeout: number = 200;
      this.windowService.nativeWindow.dispatchEvent(new Event('resize'));
      setTimeout(() => {
        this.loaded = true;
      }, timeout);
    }
  }

  makeGraphInvoicePerClient(invoicesOrderedByDateAsc: BackendInvoiceSummary[]) {
    const config = {
      responsive: true,
      displayModeBar: false,
      autosize: true,
    };
    const invoicesGroupBClient = invoicesOrderedByDateAsc.reduce((group, invoice) => {
      const sum = group.get(invoice.client) || 0;

      group.set(invoice.client, sum + invoice.subTotal);
      return group;
    }, new Map());
    const layout = (title: string, callback = (_lyt: any) => { }) => {
      let l = {
        barmode: 'group',
        dragmode: 'zoom',
        showlegend: false,
        yaxis: {
          fixedrange: true,
          type: 'linear',
        },
        xaxis: {
          fixedrange: true,
          rangeslider: {
            visible: false,
          },
        },
        title,
        autosize: true,
      };
      callback(l);
      return l;
    };
    const totalByClient = [...invoicesGroupBClient];
    const byClient = {
      name: '',
      x: totalByClient.map(([client, _tot]) => client),
      y: totalByClient.map(([_client, tot]) => tot),
      type: 'bar',
    };

    const data = [byClient];
    this.graphsPerClient$ = of([{ data: data, config: config, layout: layout('Invoice/Client') }]);
  }

  load() {
    const config = {
      responsive: true,
      displayModeBar: false,
    };
    const layout = (title: string, callback = (_) => { }) => {
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
        title,
      };
      callback(l);
      return l;
    };
    this.subscriptions.push(
      this.invoiceService
        .findAllSummaries()
        .pipe(
          map((invoices) => {
            const invoicesOrderedByDateAsc = invoices.sort(
              (a, b) =>
                DateUtils.toOptionalDate(a.dateOfInvoice).getTime() -
                DateUtils.toOptionalDate(b.dateOfInvoice).getTime(),
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

            const invoicesGroupByYear = invoicesOrderedByDateAsc.reduce((group, invoice) => {
              const dateOfInvoice = new Date(invoice.dateOfInvoice);
              const year = dateOfInvoice.getFullYear();
              const { totalAmountOfWork, totalExclVat, numberOfInvoices } = group.get(year) || {
                totalAmountOfWork: 0,
                totalExclVat: 0,
                numberOfInvoices: 0,
              };

              group.set(year, {
                totalAmountOfWork: totalAmountOfWork + this.findAmount(invoice),
                totalExclVat: totalExclVat + invoice.subTotal,
                numberOfInvoices: numberOfInvoices + 1,
              });
              return group;
            }, new Map());

            this.loaded = true;
            this.makeGraphInvoicePerClient(invoicesOrderedByDateAsc);
            return {
              invoicesGroupByYear,
              graphs,
              totalInvoices: invoicesOrderedByDateAsc.length,
              totalAmountOfWork: invoicesOrderedByDateAsc
                .map(this.findAmount)
                .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
              totalExclVat: invoicesOrderedByDateAsc
                .map((i) => i.subTotal)
                .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
            };
          }),
        )
        .subscribe((sum) => (this.summary = sum)),
    );
  }

  isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  findAmount(invoice: BackendInvoiceSummary) {
    if (invoice?.amount) {
      switch (invoice.amountType) {
        case 'HOURS':
          return invoice.amount / invoice.hoursPerDay;
        default:
          return invoice.amount;
      }
    }
    return 0;
  }

  generateGraphData(invoicesOrderedByDateAsc: BackendInvoiceSummary[]): GraphData[] {
    const graphInvoices = invoicesOrderedByDateAsc
      .map((invoice) => {
        return {
          dateOfInvoice: invoice.dateOfInvoice,
          period: invoice.period,
          subTotal: invoice.subTotal,
          amount: this.findAmount(invoice),
        };
      })
      .reduce((entryMap, e) => entryMap.set(e.period, [...(entryMap.get(e.period) || []), e]), new Map());
    const sortedAggregateData = Array.from(graphInvoices.values()).sort(
      (a, b) => new Date(a.dateOfInvoice).getTime() - new Date(b.dateOfInvoice).getTime(),
    );
    return sortedAggregateData.map((v) =>
      v.reduce((previousValue, newValue) => {
        return {
          period: newValue.period,
          subTotal: (previousValue?.subTotal || 0) + (newValue?.subTotal || 0),
          amount: (previousValue?.amount || 0) + (newValue?.amount || 0),
        } as GraphData;
      }, {}),
    );
  }
}

interface GraphData {
  period?: string;
  subTotal?: number;
  amount?: number;
}
