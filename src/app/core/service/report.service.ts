import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { Post, PostSearchCriteria } from '@core/models/post';
import { Page } from '@core/models/page';
import { DOCUMENT } from '@angular/common';
import { FileService } from '@core/service/file.service';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  basePath: string;
  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any,
    private configService: ConfigInitService,
    private fileService: FileService,
  ) {
    this.basePath = `${this.configService.getConfig()['BACKEND_URL']}/api/report`;
  }

  save(formData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.basePath}/submit`, formData, {});
  }

  newPost(): Observable<Post> {
    return this.http.post<Post>(`${this.basePath}/new-post`, {});
  }

  delete(post: Post): Observable<any> {
    return this.http.delete<any>(`${this.basePath}?id=${post.id}`);
  }

  getTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.basePath}/tags`);
  }

  publicSearch(criteria: PostSearchCriteria, page, pageSize): Observable<Page<Post>> {
    return this.http.post<Page<Post>>(
      `${this.basePath}/public-search?page=${page}&size=${pageSize}&sort=updatedDate,DESC`,
      criteria,
    );
  }

  adminSearch(criteria: PostSearchCriteria, page, pageSize): Observable<Page<Post>> {
    return this.http.post<Page<Post>>(
      `${this.basePath}/admin-search?page=${page}&size=${pageSize}&sort=updatedDate,DESC`,
      criteria,
    );
  }

  getPostById(id: string): Observable<Post> {
    return this.http.post<Post>(`${this.basePath}/post-by-id?id=${id}`, {});
  }

  getPublicPostById(id: string, title: string): Observable<Post> {
    return this.http.get<Post>(`${this.basePath}/post/${title}/${id}`);
  }

  resetPostCount(id: string): Observable<void> {
    return this.http.post<void>(`${this.basePath}/post/${id}/reset-count`, {});
  }

  getLatest(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.basePath}/latest`);
  }

  generatePdf(post: Post) {
    this.fileService.downloadLink(`${this.basePath}/generate-pdf?id=${post.id}`);
  }
}
