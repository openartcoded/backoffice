import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { InvoiceService } from '@core/service/invoice.service';
import { Observable } from 'rxjs';
import { InvoiceSummary, Invoice } from '@core/models/invoice';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-invoice-summary',
  templateUrl: './invoice-summary.component.html',
  styleUrls: ['./invoice-summary.component.scss'],
})
export class InvoiceSummaryComponent implements OnInit, OnDestroy {
  summary$: Observable<InvoiceSummary>;
  selectedYear: number = DateUtils.getCurrentYear();

  constructor(
    private invoiceService: InvoiceService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnDestroy(): void {
    this.summary$ = null;
  }

  ngOnInit(): void {
    this.load();
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

        const invoicesGroupByYear = invoicesOrderedByDateAsc.reduce((group, invoice) => {
          const dateOfInvoice = new Date(invoice.dateOfInvoice);
          const year = dateOfInvoice.getFullYear();
          const { totalAmountOfWork, totalExclVat, numberOfInvoices } = group.get(year) || {
            totalAmountOfWork: 0,
            totalExclVat: 0,
            numberOfInvoices: 0
          };

          group.set(year, {
            totalAmountOfWork: totalAmountOfWork + this.findAmount(invoice),
            totalExclVat: totalExclVat + invoice.subTotal,
            numberOfInvoices: numberOfInvoices + 1,
          });
          return group;
        }, new Map());

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
      })
    );
  }

  isBrowser() {
    return isPlatformBrowser(this.platformId);
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
