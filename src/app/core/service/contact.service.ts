import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormContact } from '@core/models/form-contact';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private http: HttpClient, private configService: ConfigInitService) {}

  public getCurriculum(): Observable<any> {
    return this.http.get<any>(`${this.configService.getConfig()['BACKEND_URL']}/api/cv`);
  }

  public findAll(): Observable<FormContact[]> {
    return this.http.post<FormContact[]>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/form-contact/find-all`,
      {}
    );
  }

  submit(formContact: FormContact): Observable<any> {
    return this.http.post<any>(`${this.configService.getConfig()['BACKEND_URL']}/api/form-contact/submit`, formContact);
  }

  delete(fc: FormContact): Observable<any> {
    return this.http.delete<any>(`${this.configService.getConfig()['BACKEND_URL']}/api/form-contact?id=${fc.id}`);
  }
}
