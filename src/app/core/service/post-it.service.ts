import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostIt } from '@core/models/postit';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class PostItService {
  basePath: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigInitService,
  ) {
    this.basePath = `${this.configService.getConfig()['BACKEND_URL']}/api/post-it`;
  }

  public findAll(): Observable<PostIt[]> {
    return this.http.get<PostIt[]>(this.basePath);
  }

  public saveOrUpdate(todo: PostIt): Observable<PostIt> {
    return this.http.post<PostIt>(this.basePath, todo);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.basePath}?id=${id}`);
  }
}
