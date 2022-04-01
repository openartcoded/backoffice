import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@core/service/auth.service';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToggleSidebarService } from '@core/service/toggle-sidebar.service';
import { Subscription } from 'rxjs';
import { MenuLink } from '@core/models/settings';
import { FallbackMenu } from './fallback-menu';
import { SettingsService } from '@core/service/settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppSettingsComponent } from '@feature/layout/app-settings/app-settings.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  links: MenuLink[];
  search: string;
  subscriptions: Subscription[];

  constructor(
    protected authService: AuthService,
    private settingsService: SettingsService,
    private modalService: NgbModal,
    private toggleSidebarService: ToggleSidebarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions = [];
    this.loadMenu();
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(this.authService.loggedIn.subscribe((d) => focus()));
    this.subscriptions.push(
      this.toggleSidebarService.toggleSideBarEvent.subscribe((toggle) => {
        if (toggle) {
          focus();
        }
      })
    );
    this.subscriptions.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationStart))
        .subscribe((event: NavigationStart) => {
          focus();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private async loadMenu() {
    this.links = null;
    let linkz = null;
    //this.filterLinks = this.links;
    try {
      linkz = await this.settingsService.getMenuLinks().toPromise();
      //this.filterLinks = this.links;
    } catch (e) {
      console.log('error loading menu links. fallback to default');
      linkz = FallbackMenu.getDefault();
    }
    this.links = linkz.filter((l) => l.show);
  }

  openSettings() {
    const ref = this.modalService.open(AppSettingsComponent, { size: 'xl' });
    ref.componentInstance.menuLinkUpdated.subscribe((m) => {
      this.loadMenu();
    });
  }
}
