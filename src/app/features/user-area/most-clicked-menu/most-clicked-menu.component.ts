import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuLink } from '@core/models/settings';
import { SettingsService } from '@core/service/settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-most-clicked-menu',
  templateUrl: './most-clicked-menu.component.html',
  styleUrls: ['./most-clicked-menu.component.scss']
})
export class MostClickedMenuComponent implements OnInit, OnDestroy {
  links: MenuLink[];
  subscription: Subscription;
  constructor(private settingsService: SettingsService, private router: Router,
    private modalService: NgbModal) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription = this.settingsService.top3().subscribe(links => {
      this.links = links;
    });
  }

  @HostListener('window:keydown', ['$event'])
  topKey(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.code === 'Digit1' && this.links?.length > 0 && !this.modalService.hasOpenModals()) {
        this.router.navigate(this.links[0].routerLink);
      } else if (event.code === 'Digit2' && this.links?.length > 1 && !this.modalService.hasOpenModals()) {
        this.router.navigate(this.links[1].routerLink);
      } else if (event.code === 'Digit3' && this.links?.length > 2 && !this.modalService.hasOpenModals()) {
        this.router.navigate(this.links[2].routerLink);
      }

    }
  }


}
