import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Post, PostSearchCriteria } from '@core/models/post';
import { Page } from '@core/models/page';
import { DOCUMENT } from '@angular/common';
import { FileService } from '@core/service/file.service';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any,
    private configService: ConfigInitService,
    private fileService: FileService
  ) {}

  save(formData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.configService.getConfig()['BACKEND_URL']}/api/blog/submit`, formData, {});
  }

  newPost(): Observable<Post> {
    return this.http.post<Post>(`${this.configService.getConfig()['BACKEND_URL']}/api/blog/new-post`, {});
  }

  delete(post: Post): Observable<any> {
    return this.http.delete<any>(`${this.configService.getConfig()['BACKEND_URL']}/api/blog?id=${post.id}`);
  }

  getTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.configService.getConfig()['BACKEND_URL']}/api/blog/tags`);
  }

  publicSearch(criteria: PostSearchCriteria, page, pageSize): Observable<Page<Post>> {
    return this.http.post<Page<Post>>(
      `${
        this.configService.getConfig()['BACKEND_URL']
      }/api/blog/public-search?page=${page}&size=${pageSize}&sort=updatedDate,DESC`,
      criteria
    );
  }

  adminSearch(criteria: PostSearchCriteria, page, pageSize): Observable<Page<Post>> {
    return this.http.post<Page<Post>>(
      `${
        this.configService.getConfig()['BACKEND_URL']
      }/api/blog/admin-search?page=${page}&size=${pageSize}&sort=updatedDate,DESC`,
      criteria
    );
  }

  getPostById(id: string): Observable<Post> {
    return this.http.post<Post>(`${this.configService.getConfig()['BACKEND_URL']}/api/blog/post-by-id?id=${id}`, {});
  }

  getPublicPostById(id: string, title: string): Observable<Post> {
    return this.http.get<Post>(`${this.configService.getConfig()['BACKEND_URL']}/api/blog/post/${title}/${id}`);
  }

  resetPostCount(id: string): Observable<void> {
    return this.http.post<void>(`${this.configService.getConfig()['BACKEND_URL']}/api/blog/post/${id}/reset-count`, {});
  }

  getLatest(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.configService.getConfig()['BACKEND_URL']}/api/blog/latest`);
  }

  generatePdf(post: Post) {
    this.fileService.downloadLink(
      `${this.configService.getConfig()['BACKEND_URL']}/api/blog/generate-pdf?id=${post.id}`
    );
  }
}
