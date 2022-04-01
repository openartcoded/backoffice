import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Dossier, DossierSummary } from '@core/models/dossier';
import { DossierService } from '@core/service/dossier.service';
import { WindowRefService } from '@core/service/window.service';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  dossierSummaries: DossierSummary[];
  graphs: any;

  constructor(
    private dossierService: DossierService,
    private windowService: WindowRefService,
    @Inject(PLATFORM_ID) private platformId: any,
    private breakPointObserver: BreakpointObserver
  ) {}

  async ngOnInit() {
    const summaries = [];
    const dossiers = await this.dossierService.findAll(true).toPromise();
    for (let d of dossiers) {
      const summary = await this.dossierService.getSummary(d.id).toPromise();
      summary.dossier = d;
      summaries.push(summary);
    }
    this.loadGraph(summaries);
  }

  loadGraph(summaries: DossierSummary[]) {
    const orderedSummaries = summaries.sort(
      (s1, s2) => new Date(s1.dossier?.creationDate).getTime() - new Date(s2.dossier?.creationDate).getTime()
    );
    const config = {
      responsive: true,
      displayModeBar: false,
    };

    const layout = (title: string, callback = (lyt) => {}) => {
      let l = {
        barmode: 'group',
        dragmode: 'zoom',
        showlegend: true,
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
    const earnings = {
      name: 'Earnings',
      x: orderedSummaries.map((d) => d.name),
      y: orderedSummaries.map((r) => r.totalEarnings),
      type: 'bar',
    };
    const expenses = {
      name: 'Expenses',
      x: orderedSummaries.map((d) => d.name),
      y: orderedSummaries.map((g) => g.totalExpenses),
      type: 'bar',
    };
    const data = [earnings, expenses];
    this.graphs = [{ data: data, config: config, layout: layout('Earnings/Expenses') }];
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
}
