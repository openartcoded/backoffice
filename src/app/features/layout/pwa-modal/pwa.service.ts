import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PwaModalComponent } from './pwa-modal.component';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  constructor(private readonly updates: SwUpdate, private modalDialog: NgbModal) {
    updates.unrecoverable.subscribe((event) => {
      console.log('An error occurred that we cannot recover from:\n' + event.reason + '\n\nPlease reload the page.');
    });
    updates.available.subscribe((event) => {
      this.showAppUpdateAlert();
    });
    updates.activated.subscribe((event) => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }

  showAppUpdateAlert() {
    this.modalDialog.open(PwaModalComponent, {});
  }
}
