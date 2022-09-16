import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { InfoService } from '@core/service/info.service';
import { WindowRefService } from '@core/service/window.service';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  loaded: boolean = true;

  constructor(
    private titleService: Title,
    private breakPointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowService: WindowRefService,
    private infoService: InfoService
  ) {}

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
    }

    const backendInfo = await firstValueFrom(this.infoService.getBuildInfo());
    this.titleService.setTitle('BackOffice - ' + backendInfo.build.version);
  }
}
