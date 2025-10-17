import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@core/service/auth.service';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToggleSidebarService } from '@core/service/toggle-sidebar.service';
import { Subscription } from 'rxjs';
import { MenuLink } from '@core/models/settings';
import { SettingsService } from '@core/service/settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppSettingsComponent } from '@feature/layout/app-settings/app-settings.component';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { User } from '@core/models/user';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  links: MenuLink[];
  search: string;
  subscriptions: Subscription[];
  user: User;
  get hasRoleAdmin(): boolean {
    return this.user.authorities.includes('ADMIN');
  }

  constructor(
    protected authService: AuthService,
    private settingsService: SettingsService,
    private modalService: NgbModal,
    private toggleSidebarService: ToggleSidebarService,
    private personalInfoService: PersonalInfoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscriptions = [];
    this.personalInfoService.me().subscribe((u) => (this.user = u));
    this.loadMenu();
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(this.authService.loggedIn.subscribe((d) => focus()));
    this.subscriptions.push(
      this.toggleSidebarService.toggleSideBarEvent.subscribe((toggle) => {
        if (toggle) {
          focus();
        }
      }),
    );
    this.subscriptions.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationStart))
        .subscribe((event: NavigationStart) => {
          focus();
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private loadMenu() {
    this.settingsService._menuLinks.subscribe((menuLinks) => (this.links = menuLinks.filter((l) => l.show)));
  }

  openSettings() {
    const ref = this.modalService.open(AppSettingsComponent, {
      size: 'xl',
      scrollable: true,
    });
    ref.componentInstance.user = this.user;
  }
}
