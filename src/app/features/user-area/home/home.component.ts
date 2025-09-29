import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BackendInfo } from '@core/models/backend.info';
import { Dossier } from '@core/models/dossier';
import { HealthIndicator } from '@core/models/health.indicator';
import { PersonalInfo } from '@core/models/personal.info';
import { User } from '@core/models/user';
import { DossierService } from '@core/service/dossier.service';
import { InfoService } from '@core/service/info.service';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { WindowRefService } from '@core/service/window.service';
import { Observable, Subscription, combineLatest, firstValueFrom, map } from 'rxjs';

type Indicators = { buildInfo: BackendInfo; healthIndicator: HealthIndicator };
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    indicators$: Observable<Indicators>;
    user: User;
    activeDossier: Dossier;

    personalInfo: PersonalInfo;
    loaded: boolean = true;

    constructor(
        private titleService: Title,
        private breakPointObserver: BreakpointObserver,
        private infoService: InfoService,
        private personalInfoService: PersonalInfoService,
        private dossierService: DossierService,
        @Inject(PLATFORM_ID) private platformId: any,
        private windowService: WindowRefService,
    ) { }

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
            this.indicators$ = combineLatest([this.infoService.getBuildInfo(), this.infoService.getHealth()]).pipe(
                map(([buildInfo, healthIndicator]) => ({ buildInfo, healthIndicator })),
            );
        }

        this.titleService.setTitle('Artcoded BackOffice');
    }
}
