import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '@core/models/page';
import { Memz } from '@core/models/memz';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class MemzService {
  constructor(
    private http: HttpClient,
    private configService: ConfigInitService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  save(formData: FormData): Observable<Memz> {
    return this.http.post<Memz>(`${this.configService.getConfig()['BACKEND_URL']}/api/memzagram/submit`, formData, {});
  }

  findAll(page, pageSize): Observable<Page<Memz>> {
    return this.http.get<Page<Memz>>(
      `${
        this.configService.getConfig()['BACKEND_URL']
      }/api/memzagram/public?page=${page}&size=${pageSize}&sort=updatedDate,DESC`,
      {}
    );
  }

  adminFindAll(page, pageSize): Observable<Page<Memz>> {
    return this.http.get<Page<Memz>>(
      `${
        this.configService.getConfig()['BACKEND_URL']
      }/api/memzagram/all?page=${page}&size=${pageSize}&sort=updatedDate,DESC`,
      {}
    );
  }

  delete(memz: Memz): Observable<any> {
    return this.http.delete<any>(`${this.configService.getConfig()['BACKEND_URL']}/api/memzagram?id=${memz.id}`);
  }
}
