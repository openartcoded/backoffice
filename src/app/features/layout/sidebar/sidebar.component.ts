import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "@core/service/auth.service";
import { NavigationStart, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { ToggleSidebarService } from "@core/service/toggle-sidebar.service";
import { Subscription } from "rxjs";
import { MenuLink } from "@core/models/settings";
import { FallbackMenu } from "./fallback-menu";
import { SettingsService } from "@core/service/settings.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AppSettingsComponent } from "@feature/layout/app-settings/app-settings.component";

import {Offcanvas} from "bootstrap";
var offcanvasElementList = [].slice.call(document.querySelectorAll('.offcanvas'))
var offcanvasList = offcanvasElementList.map(function (offcanvasEl) {
  return new Offcanvas(offcanvasEl)
})

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
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
    this.subscriptions.push(
      this.authService.loggedIn.subscribe((d) => focus())
    );
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

  private loadMenu() {
    this.links = FallbackMenu.getDefault().filter((l) => l.show);
    //this.filterLinks = this.links;
    this.settingsService
      .getMenuLinks()
      .subscribe((links) => (this.links = links.filter((l) => l.show))),
      (err) => {
        console.log(err, "error loading menu links. fallback to default");
      };
  }

  openSettings() {
    const ref = this.modalService.open(AppSettingsComponent, {
      size: "xl",
      scrollable: true,
    });
    ref.componentInstance.menuLinkUpdated.subscribe((m) => {
      this.loadMenu();
    });
  }
}
