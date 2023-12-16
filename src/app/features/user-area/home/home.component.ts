import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BackendInfo } from '@core/models/backend.info';
import { HealthIndicator } from '@core/models/health.indicator';
import { InfoService } from '@core/service/info.service';
import { WindowRefService } from '@core/service/window.service';
import { Observable, Subscription, combineLatest, map } from 'rxjs';

type Indicators = { buildInfo: BackendInfo; healthIndicator: HealthIndicator };
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  indicators$: Observable<Indicators>;

  loaded: boolean = true;

  constructor(
    private titleService: Title,
    private breakPointObserver: BreakpointObserver,
    private infoService: InfoService,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowService: WindowRefService,
  ) { }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // WORKAROUND bug plotly responsive
      this.subscription = this.breakPointObserver
        .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
        .subscribe(() => {
          this.loaded = false;
          this.windowService.nativeWindow.dispatchEvent(new Event('resize'));
          setTimeout(() => {
            this.loaded = true;
          }, 150);
        });
      this.indicators$ = combineLatest([this.infoService.getBuildInfo(), this.infoService.getHealth()]).pipe(
        map(([buildInfo, healthIndicator]) => ({ buildInfo, healthIndicator })),
      );
    }

    this.titleService.setTitle('Artcoded BackOffice');
  }
}
