import { Component, Inject, OnInit, Optional, PLATFORM_ID } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-pwa-modal',
  templateUrl: './pwa-modal.component.html',
  styleUrls: ['./pwa-modal.component.scss'],
  standalone: false,
})
export class PwaModalComponent implements OnInit {
  constructor(
    @Optional() public activeModal: NgbActiveModal,
    @Inject(DOCUMENT) private document: Document,
    private readonly updates: SwUpdate,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {}

  ngOnInit(): void {}

  reloadApp() {
    if (isPlatformBrowser(this.platformId)) {
      this.updates.activateUpdate().then(() => this.document.location.reload());
    }
  }
}
