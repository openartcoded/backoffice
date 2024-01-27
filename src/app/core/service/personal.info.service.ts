import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonalInfo } from '@core/models/personal.info';
import { ConfigInitService } from '@init/config-init.service';
import { User } from '@core/models/user';

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoService {
  basePath: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigInitService,
  ) {
    this.basePath = `${configService.getConfig()['BACKEND_URL']}/api/personal-info`;
  }

  public get(): Observable<PersonalInfo> {
    return this.http.get<PersonalInfo>(this.basePath);
  }

  public me(): Observable<User> {
    return this.http.get<User>(this.basePath + '/@me');
  }
  public save(formData: FormData): Observable<PersonalInfo> {
    return this.http.post<PersonalInfo>(this.basePath + '/submit', formData);
  }
}
