import { ApplicationInitStatus, EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { User } from '@core/models/user';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { Subscription } from 'rxjs';
import { WindowRefService } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _token: string;
  loggedOut: EventEmitter<any> = new EventEmitter<any>();
  keycloakSubscription: Subscription;
  loggedIn: EventEmitter<any> = new EventEmitter<any>();
  tokenRefreshed: EventEmitter<string> = new EventEmitter<any>();
  constructor(private keycloakService: KeycloakService, private appInit: ApplicationInitStatus, private windowService: WindowRefService) {
    this.appInit.donePromise.then(() => this.onInit());
  }
  ngOnDestroy(): void {
    this.keycloakSubscription.unsubscribe();
  }
  onInit(): any {
    this.keycloakSubscription = this.keycloakService.keycloakEvents$.subscribe(async (e) => {
      if (
        e.type == KeycloakEventType.OnAuthError ||
        e.type == KeycloakEventType.OnAuthLogout ||
        e.type == KeycloakEventType.OnAuthRefreshError
      ) {
        this.keycloakService.clearToken();
        this.windowService?.nativeWindow?.sessionStorage?.clear();
        this.loggedOut.emit();
      }
      if (e.type == KeycloakEventType.OnAuthSuccess || e.type == KeycloakEventType.OnAuthRefreshSuccess) {
        await this.refreshToken();
      }
      if (e.type == KeycloakEventType.OnTokenExpired) {
        this.keycloakService.updateToken(180);
      }
    });
  }

  get token() {
    if (!this._token) {
      this.refreshToken();
    }
    return this._token;
  }

  async refreshToken() {
    const t = await this.keycloakService.getToken();
    this._token = 'Bearer ' + t;
    this.loggedIn.emit();
    this.tokenRefreshed.emit(this._token);
  }

  logout(redirect: boolean = true): void {
    this.keycloakService.logout(redirect ? '' : null);
  }

  getUser(): User {
    return {
      username: this.keycloakService.getUsername(),
    } as User;
  }
}
