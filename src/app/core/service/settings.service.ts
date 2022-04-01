import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { MenuLink } from '@core/models/settings';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private basePath: string;

  constructor(private http: HttpClient, configService: ConfigInitService) {
    this.basePath = `${configService.getConfig()['BACKEND_URL']}/api/settings/menu-link`;
  }

  public getMenuLinks(): Observable<MenuLink[]> {
    return this.http.get<MenuLink[]>(`${this.basePath}`);
  }

  updateMenuLinks(menuLink: MenuLink): Observable<MenuLink> {
    return this.http.post<MenuLink>(`${this.basePath}/save`, menuLink);
  }

  importAllMenuLinks(menuLinks: MenuLink[]): Observable<void> {
    return this.http.post<void>(`${this.basePath}/import`, menuLinks);
  }

  deleteMenuLinkById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.basePath}?id=${id}`);
  }
}
