import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '@core/models/todo';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  basePath: string;

  constructor(private http: HttpClient, private configService: ConfigInitService) {
    this.basePath = `${this.configService.getConfig()['BACKEND_URL']}/api/todo`;
  }

  public findAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.basePath);
  }

  public saveOrUpdate(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.basePath, todo);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.basePath}?id=${id}`);
  }
}
