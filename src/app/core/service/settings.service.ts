import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuLink } from '@core/models/settings';
import { ConfigInitService } from '@init/config-init.service';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private basePath: string;

  public readonly _menuLinks: EventEmitter<MenuLink[]> = new EventEmitter<MenuLink[]>();

  constructor(
    private http: HttpClient,
    configService: ConfigInitService,
  ) {
    this.basePath = `${configService.getConfig()['BACKEND_URL']}/api/settings/menu-link`;
    this.emitMenuLinks();
  }

  emitMenuLinks() {
    this.getMenuLinks()
      .pipe(take(1))
      .subscribe((links) => this._menuLinks.emit(links));
  }

  public getMenuLinks(): Observable<MenuLink[]> {
    return this.http.get<MenuLink[]>(`${this.basePath}`);
  }

  updateMenuLinks(menuLink: MenuLink): Observable<MenuLink> {
    return this.http.post<MenuLink>(`${this.basePath}/save`, menuLink).pipe(
      tap({
        next: (x) => {
          this.emitMenuLinks();
        },
        error: (err) => {
          console.error(err);
        },
      }),
    );
  }

  clicked(id: string): Observable<void> {
    return this.http.post<void>(`${this.basePath}/clicked?id=${id}`, {});
  }

  top3(): Observable<MenuLink[]> {
    return this.http.get<MenuLink[]>(`${this.basePath}/top-3`);
  }
  top5(): Observable<MenuLink[]> {
    return this.http.get<MenuLink[]>(`${this.basePath}/top-5`);
  }
  importAllMenuLinks(menuLinks: MenuLink[]): Observable<void> {
    return this.http.post<void>(`${this.basePath}/import`, menuLinks).pipe(
      tap({
        next: () => {
          this.emitMenuLinks();
        },
        error: (err) => {
          console.error(err);
        },
      }),
    );
  }

  deleteMenuLinkById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.basePath}?id=${id}`).pipe(
      tap({
        next: () => {
          this.emitMenuLinks();
        },
        error: (err) => {
          console.error(err);
        },
      }),
    );
  }
}
