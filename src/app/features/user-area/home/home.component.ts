import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Dossier } from '@core/models/dossier';
import { PersonalInfo } from '@core/models/personal.info';
import { User } from '@core/models/user';
import { DossierService } from '@core/service/dossier.service';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { WindowRefService } from '@core/service/window.service';
import { Subscription, firstValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  user: User;
  activeDossier: Dossier;

  personalInfo: PersonalInfo;
  loaded: boolean = true;

  constructor(
    private titleService: Title,
    private breakPointObserver: BreakpointObserver,
    private personalInfoService: PersonalInfoService,
    private dossierService: DossierService,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowService: WindowRefService,
  ) {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get hasRoleAdmin(): boolean {
    return this.user.authorities.includes('ADMIN');
  }
  async ngOnInit() {
    this.user = await firstValueFrom(this.personalInfoService.me());
    this.personalInfo = await firstValueFrom(this.personalInfoService.get());

    this.dossierService.activeDossier().subscribe((dt) => (this.activeDossier = dt));
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

    this.titleService.setTitle('Artcoded BackOffice');
  }
}
