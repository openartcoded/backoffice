import { Component, EventEmitter, OnInit, Output, PLATFORM_ID, Inject, OnDestroy, ViewChild } from '@angular/core';

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { ConfigInitService } from '@init/config-init.service';
import { MenuLink } from '@core/models/settings';
import { SettingsService } from '@core/service/settings.service';
import { FallbackMenu } from '../sidebar/fallback-menu';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable, OperatorFunction, Subject, Subscription, firstValueFrom, merge } from 'rxjs';
import { environment } from '@env/environment';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { CacheComponent } from '../cache/cache.component';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { User } from '@core/models/user';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false,
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
  ) {}
  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  formatter = (item: any) => (item ? item.title : '');
  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance?.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map((term) =>
        !term?.length
          ? this.links
          : this.links.filter((l) => l.title.toLowerCase().includes(term.toLowerCase())).slice(0, 10),
      ),
    );
  };
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
            .subscribe(async (event: NavigationEnd) => {
              const link = filteredLinks.find((l) => {
                const menuLinkUrl = ('/' + l.routerLink.join('/')).trim();
                if (menuLinkUrl === '/') {
                  return event.url === '/';
                }
                return event.url.includes(menuLinkUrl);
              });
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
