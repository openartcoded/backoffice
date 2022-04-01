import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WindowRefService } from '@core/service/window.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-tick-chart',
  templateUrl: './tick-chart.component.html',
  styleUrls: ['./tick-chart.component.scss'],
})
export class TickChartComponent implements OnInit {
  @Input()
  labels: string[];
  @Input()
  close: number[];
  @Input()
  open: number[];
  @Input()
  low: number[];
  @Input()
  high: number[];
  @Input()
  volume: number[];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private windowService: WindowRefService,
    private breakPointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.data = [
      {
        x: this.labels,
        close: this.close || [],
        decreasing: { line: { color: '#7F7F7F' } },

        high: this.high || [],
        increasing: { line: { color: '#17BECF' } },

        line: { color: 'rgba(31,119,180,1)' },

        low: this.low || [],
        open: this.open || [],
        type: 'candlestick',
        xaxis: 'x',
        yaxis: 'y',
      },
      /*   {
           type: "scatter",
           mode: "lines",
           name: 'High',
           x: this.labels,
           y: this.close || [],
         }*/
    ];
    this.layout = {
      dragmode: 'zoom',
      showlegend: false,
      yaxis: {
        autorange: true,
        type: 'linear',
      },
      xaxis: {
        fixedrange: true,
        rangeslider: {
          visible: false,
        },
      },
    };
    this.config = { responsive: true, displayModeBar: false };
  }

  data;

  layout;
  config: any;

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
