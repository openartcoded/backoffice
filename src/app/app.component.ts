import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './core/service/auth.service';
import { Meta, Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ToggleSidebarService } from '@core/service/toggle-sidebar.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  toggle: boolean;
  appSubscriptions: Subscription[] = [];
  isDesktop: boolean;

  constructor(
    protected authService: AuthService,
    private cdr: ChangeDetectorRef,
    private toggleSidebarService: ToggleSidebarService,
    private breakPointObserver: BreakpointObserver,
    private titleService: Title,
    private metaService: Meta,
    private modalService: NgbModal,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.toggleCheck();
    this.appSubscriptions.push(this.authService.loggedIn.subscribe(() => this.toggleCheck()));
    this.appSubscriptions.push(this.authService.loggedOut.subscribe(() => this.toggleCheck()));
    this.breakPointObserver.observe([Breakpoints.XSmall, Breakpoints.Tablet]).subscribe((state: BreakpointState) => {
      this.isDesktop = !state.matches;
    });
    this.updateMetas();
  }

  expand(_$event: any): void {
    this.toggle = this.toggleSidebarService.expand(this.toggle);
  }

  private updateMetas() {
    let title = 'Nordine Bittich - Full-Stack Developer in Brussels';
    let description = 'Looking for a custom application matching perfectly your business requirements?';
    this.titleService.setTitle(title);
    this.metaService.updateTag({
      name: 'description',
      content: description,
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: title,
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: description,
    });
    this.metaService.updateTag({
      property: 'og:image',
      content: '/assets/img/logo.png',
    });

    this.metaService.updateTag({
      property: 'twitter:title',
      content: title,
    });
    this.metaService.updateTag({
      property: 'twitter:description',
      content: description,
    });
    this.metaService.updateTag({
      property: 'twitter:image',
      content: '/assets/img/logo.png',
    });
  }

  ngOnDestroy(): void {
    this.appSubscriptions.forEach((sub) => sub.unsubscribe());
    this.appSubscriptions = [];
  }

  private toggleCheck() {
    this.toggle = this.toggleSidebarService.toggleCheck();
    this.cdr.detectChanges();
  }
  @HostListener('document:keydown.control.²')
  home() {
    if (!this.modalService.hasOpenModals()) {
      this.router.navigate(['']);
    }
  }
}
