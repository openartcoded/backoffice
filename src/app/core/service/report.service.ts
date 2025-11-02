import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post, PostItType, PostSearchCriteria } from '@core/models/post';
import { Page } from '@core/models/page';
import { FileService } from '@core/service/file.service';
import { ConfigInitService } from '@init/config-init.service';
import { PostIt } from '@core/models/postit';

@Injectable({
    providedIn: 'root',
})
export class ReportService {
    basePath: string;
    constructor(
        private http: HttpClient,
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

    publicSearch(criteria: PostSearchCriteria, page: number, pageSize: number): Observable<Page<Post>> {
        return this.http.post<Page<Post>>(
            `${this.basePath}/public-search?page=${page}&size=${pageSize}&sort=updatedDate,DESC`,
            criteria,
        );
    }
    addAttachment(postId: string, file: File): Observable<Post> {
        let formData = new FormData();
        formData.append('id', postId);
        formData.append('file', file);

        return this.http.post<Post>(`${this.basePath}/add-attachment`, formData);
    }
    removeAttachment(postId: string, attachmentId: string): Observable<Post> {
        return this.http.post<Post>(`${this.basePath}/remove-attachment?id=${postId}&attachmentId=${attachmentId}`, {});
    }
    adminSearch(criteria: PostSearchCriteria, page: number, pageSize: number): Observable<Page<Post>> {
        return this.http.post<Page<Post>>(
            `${this.basePath}/admin-search?page=${page}&size=${pageSize}&sort=updatedDate,DESC`,
            criteria,
        );
    }

    updatePostIts(id: string, postIts: PostIt[], updateType: PostItType): Observable<Post> {
        return this.http.post<Post>(`${this.basePath}/update-post-it?id=${id}&postItType=${updateType}`, postIts);
    }

    getPostById(id: string): Observable<Post> {
        return this.http.post<Post>(`${this.basePath}/post-by-id?id=${id}`, {});
    }

    getPublicPostById(id: string, title: string): Observable<Post> {
        return this.http.get<Post>(`${this.basePath}/post/${title}/${id}`);
    }

    getLatest(): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.basePath}/latest`);
    }

    generatePdf(post: Post) {
        this.fileService.downloadLink(`${this.basePath}/generate-pdf?id=${post.id}`);
    }
}
