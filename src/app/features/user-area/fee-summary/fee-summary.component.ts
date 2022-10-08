import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FeeService } from '@core/service/fee.service';
import { firstValueFrom, Observable, of } from 'rxjs';

@Component({
  selector: 'app-fee-summary',
  templateUrl: './fee-summary.component.html',
  styleUrls: ['./fee-summary.component.scss'],
})
export class FeeSummaryComponent implements OnInit, OnDestroy {
  graphs$: Observable<any>;
  showGraph: boolean;
  constructor(private feeService: FeeService, @Inject(PLATFORM_ID) private platformId: any) {}
  ngOnDestroy(): void {
    this.graphs$ = null;
  }

  ngOnInit(): void {
    this.load();
  }

  async load() {
    let summaries = await firstValueFrom(this.feeService.summaries());
    summaries = summaries
      .filter((t) => t.tag.toLowerCase() !== 'other' && t.totalHVAT !== 0)
      .sort((a, b) => b.totalHVAT - a.totalHVAT);
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
          type: 'linear',
        },
        xaxis: {
          fixedrange: true,
          rangeslider: {
            visible: false,
          },
        },
        title: title,
      };
      callback(l);
      return l;
    };
    const totalHVAT = {
      name: 'Total HVAT',
      x: summaries.map((f) => f.tag),
      y: summaries.map((r) => r.totalHVAT),
      type: 'bar',
    };
    const totalVAT = {
      name: 'VAT',
      x: summaries.map((f) => f.tag),
      y: summaries.map((r) => r.totalVAT),
      type: 'bar',
    };
    const data = [totalHVAT, totalVAT];
    this.graphs$ = of([{ data: data, config: config, layout: layout('Expenses') }]);
    setTimeout(() => {
      this.showGraph = true;
    }, 150);
  }

  isBrowser() {
    return isPlatformBrowser(this.platformId);
  }
}
