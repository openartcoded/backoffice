import { Component, EventEmitter, OnInit, Output, Optional, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { ConfigInitService } from '@init/config-init.service';
import { MenuLink } from '@core/models/settings';
import { SettingsService } from '@core/service/settings.service';
import { FallbackMenu } from '../sidebar/fallback-menu';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription, firstValueFrom } from 'rxjs';
import { environment } from '@env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CacheComponent } from '../cache/cache.component';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { User } from '@core/models/user';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output('toggleExpand')
  toggleEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  env: any;
  navigationSubscriptions: Subscription[] = [];
  links: MenuLink[];
  user: User;

  link: MenuLink;
  version = environment.version;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private configInitService: ConfigInitService,
    private personalInfoService: PersonalInfoService,
    private settingsService: SettingsService,
    private modalService: NgbModal,
    private router: Router,
    private readonly updates: SwUpdate,
    @Inject(PLATFORM_ID) private platformId: any,
  ) { }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
  reload() {
    if (isPlatformBrowser(this.platformId)) {
      this.document.location.reload();
    }
  }

  openCacheModal() {
    this.modalService.open(CacheComponent, { size: 'sm' });
  }

  refreshPwa() {
    if (isPlatformBrowser(this.platformId)) {
      this.updates.activateUpdate().then(() => this.document.location.reload());
    }
  }
  unsubscribe() {
    this.navigationSubscriptions.forEach((n) => n.unsubscribe());
    this.navigationSubscriptions = [];
  }
  get hasRoleAdmin(): boolean {
    return this.user.authorities.includes('ADMIN');
  }
  ngOnInit(): void {
    this.env = this.configInitService.getConfig()['ENV_TYPE'];
    this.links = FallbackMenu.getDefault().filter((l) => l.show);
    this.navigationSubscriptions.push(this.personalInfoService.me().subscribe((u) => (this.user = u)));

    this.navigationSubscriptions.push(
      this.settingsService._menuLinks.subscribe(
        (links) => {
          const filteredLinks = links.filter((l) => l.show);
          const link = filteredLinks.find((l) => l.routerLink.join('/') === this.router.url.substring(1));
          if (link) {
            this.link = link;
          }
          this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(async (event: NavigationStart) => {
              const link = filteredLinks.find((l) => l.routerLink.join('/') === event.url.substring(1));
              if (link) {
                this.link = link;
                const checkLink = link.routerLink.join('/');

                if (checkLink !== '/' && checkLink !== '') {
                  await firstValueFrom(this.settingsService.clicked(link.id));
                }
              }
            });
          this.links = filteredLinks;
        },
        (err) => {
          console.log(err, 'error loading menu links. fallback to default');
        },
      ),
    );
  }

  toggle() {
    this.toggleEventEmitter.emit();
  }
  menuChange() {
    if (this.link) {
      this.router.navigate(this.link.routerLink);
    }
  }
}
