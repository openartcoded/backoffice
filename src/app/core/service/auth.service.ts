import { EventEmitter, Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { User } from '@core/models/user';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token: string;
  loggedOut: EventEmitter<any> = new EventEmitter<any>();
  loggedIn: EventEmitter<any> = new EventEmitter<any>();
  tokenRefreshed: EventEmitter<string> = new EventEmitter<any>();
  constructor(private keycloakService: KeycloakService) {
    this.keycloakService.keycloakEvents$.subscribe(async (e) => {
      if (
        e.type == KeycloakEventType.OnAuthError ||
        e.type == KeycloakEventType.OnAuthLogout ||
        e.type == KeycloakEventType.OnAuthRefreshError
      ) {
        this.loggedOut.emit();
      }
      if (e.type == KeycloakEventType.OnAuthSuccess) {
        await this.refreshToken();
      }
      if (e.type == KeycloakEventType.OnAuthRefreshSuccess) {
        await this.refreshToken();
      }
      if (e.type == KeycloakEventType.OnTokenExpired) {
        this.keycloakService.updateToken(20);
      }
    });
  }

  get token() {
    if(!this._token){
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
