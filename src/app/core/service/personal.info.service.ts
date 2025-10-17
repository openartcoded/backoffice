import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonalInfo } from '@core/models/personal.info';
import { ConfigInitService } from '@init/config-init.service';
import { User } from '@core/models/user';
import { shareReplay, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class PersonalInfoService {
  basePath: string;
  private personalInfoCache$?: Observable<PersonalInfo>;
  private meCache$?: Observable<User>;
  constructor(
    private http: HttpClient,
    configService: ConfigInitService,
  ) {
    this.basePath = `${configService.getConfig()['BACKEND_URL']}/api/personal-info`;
  }

  public get(): Observable<PersonalInfo> {
    if (!this.personalInfoCache$) {
      this.personalInfoCache$ = this.http.get<PersonalInfo>(this.basePath).pipe(shareReplay(1));
    }
    return this.personalInfoCache$;
  }

  public me(): Observable<User> {
    if (!this.meCache$) {
      this.meCache$ = this.http.get<User>(this.basePath + '/@me').pipe(shareReplay(1));
    }
    return this.meCache$;
  }
  public save(formData: FormData): Observable<PersonalInfo> {
    return this.http.post<PersonalInfo>(this.basePath + '/submit', formData).pipe(
      tap(() => {
        this.personalInfoCache$ = undefined;
        this.meCache$ = undefined;
      }),
    );
  }
}
