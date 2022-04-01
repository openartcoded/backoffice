import { Component, EventEmitter, OnInit, Output, Optional, PLATFORM_ID, Inject } from '@angular/core';

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';
import { ConfigInitService } from '@init/config-init.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output('toggleExpand')
  toggleEventEmitter: EventEmitter<void> = new EventEmitter<void>();
  env: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private configInitService: ConfigInitService,
    private readonly updates: SwUpdate,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}
  refreshPwa() {
    if (isPlatformBrowser(this.platformId)) {
      this.updates.activateUpdate().then(() => this.document.location.reload());
    }
  }

  ngOnInit(): void {
    this.env = this.configInitService.getConfig()['ENV_TYPE'];
  }

  toggle() {
    this.toggleEventEmitter.emit();
  }
}
