import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root',
})
export class GdprService {
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}

  gdprConsent() {
    //let bannerClosed: boolean = this.storage.get('bannerClosed');
    //return bannerClosed !== false;
    return false; // disabled for ADMIN CONSOLE
  }

  toggleConsent(checked: boolean) {
    if (checked) {
      this.storage.set('bannerClosed', false);
    } else {
      this.storage.remove('bannerClosed');
    }
  }
}
