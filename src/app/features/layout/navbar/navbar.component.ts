import { Component, EventEmitter, OnInit, Output, Optional, PLATFORM_ID, Inject } from '@angular/core';

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { ConfigInitService } from '@init/config-init.service';
import { MenuLink } from '@core/models/settings';
import { SettingsService } from '@core/service/settings.service';
import { FallbackMenu } from '../sidebar/fallback-menu';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output('toggleExpand')
  toggleEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  env: any;

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

  private loadMenu() {
    this.links = FallbackMenu.getDefault().filter((l) => l.show);
    this.settingsService.getMenuLinks().subscribe((links) => (this.links = links.filter((l) => l.show))),
      (err) => {
        console.log(err, 'error loading menu links. fallback to default');
      };
  }

  refreshPwa() {
    if (isPlatformBrowser(this.platformId)) {
      this.updates.activateUpdate().then(() => this.document.location.reload());
    }
  }

  ngOnInit(): void {
    this.env = this.configInitService.getConfig()['ENV_TYPE'];
    this.loadMenu();
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
