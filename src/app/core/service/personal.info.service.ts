import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { PersonalInfo } from '@core/models/personal.info';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoService {
  basePath: string;

  constructor(private http: HttpClient, private configService: ConfigInitService) {
    this.basePath = `${configService.getConfig()['BACKEND_URL']}/api/personal-info`;
  }

  public get(): Observable<PersonalInfo> {
    return this.http.get<PersonalInfo>(this.basePath);
  }

  public save(formData: FormData): Observable<PersonalInfo> {
    return this.http.post<PersonalInfo>(this.basePath + '/submit', formData);
  }
}
