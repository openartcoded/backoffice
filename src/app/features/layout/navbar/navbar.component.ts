import { Component, EventEmitter, OnInit, Output, Optional, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { ConfigInitService } from '@init/config-init.service';
import { MenuLink } from '@core/models/settings';
import { SettingsService } from '@core/service/settings.service';
import { FallbackMenu } from '../sidebar/fallback-menu';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
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

  link: MenuLink;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private configInitService: ConfigInitService,
    private settingsService: SettingsService,
    private router: Router,
    private readonly updates: SwUpdate,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe();
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
  ngOnInit(): void {
    this.env = this.configInitService.getConfig()['ENV_TYPE'];
    this.links = FallbackMenu.getDefault().filter((l) => l.show);
    this.navigationSubscriptions.push(
      this.settingsService._menuLinks.subscribe(
        (links) => {
          const filteredLinks = links.filter((l) => l.show);
          this.link = filteredLinks.find((l) => l.routerLink.join('/') === this.router.url.substring(1));

          this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: NavigationStart) => {
              this.link = filteredLinks.find((l) => l.routerLink.join('/') === event.url.substring(1));
            });
          this.links = filteredLinks;
        },
        (err) => {
          console.log(err, 'error loading menu links. fallback to default');
        }
      )
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
