import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUpload, FileUploadSearchCriteria } from '../models/file-upload';
import { Page } from '../models/page';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { WindowRefService } from './window.service';
import { map } from 'rxjs/operators';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  basePath: string;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any,
    private configService: ConfigInitService,
    private formBuilder: FormBuilder
  ) {
    this.basePath = `${this.configService.getConfig()['BACKEND_URL']}/api/resource`;
  }

  uploadFileList(
    fileList: FileList,
    publicResource: boolean = false,
    correlationId: string = null
  ): Observable<FileUpload> {
    if (fileList?.length === 1) {
      let f: File = fileList.item(0);
      const formData: FormData = new FormData();
      formData.append('file', f);
      formData.append('correlationId', correlationId);
      formData.append('publicResource', String(publicResource));
      return this.upload(formData);
    }
    throw new Error('file list cannot be empty or only one file accepted');
  }

  upload(formData: FormData): Observable<FileUpload> {
    return this.http.post<FileUpload>(`${this.basePath}/upload`, formData, {});
  }

  findById(id: string): Observable<FileUpload> {
    const url = `${this.basePath}/find-by-id?id=${id}`;
    return this.http.get<FileUpload>(url, {});
  }

  findByPublicId(id: string): Observable<FileUpload> {
    const url = `${this.basePath}/public/find-by-id?id=${id}`;
    return this.http.get<FileUpload>(url, {});
  }

  findByCorrelationId(id: string): Observable<FileUpload[]> {
    const url = `${this.basePath}/find-by-correlation-id?correlationId=${id}`;
    return this.http.get<FileUpload[]>(url, {});
  }

  findByCorrelationIdPublic(id: string): Observable<FileUpload[]> {
    const url = `${this.basePath}/public/find-by-correlation-id?correlationId=${id}`;
    return this.http.get<FileUpload[]>(url, {});
  }

  getDownloadUrl(id: string): string {
    return `${this.basePath}/download?id=${id}`;
  }

  getPublicDownloadUrl(id: string): string {
    return `${this.basePath}/public/download/${id}`;
  }

  download(file: FileUpload): void {
    this.downloadLink(this.getDownloadUrl(file.id));
  }

  downloadLink(link: string): void {
    this.toDownloadLink(link).subscribe((downloadLink) => {
      this.document.body.appendChild(downloadLink);
      downloadLink.click();
    });
  }

  createFile(value: string, fileName: string, contentType: string) {
    if (isPlatformBrowser(this.platformId)) {
      const link = document.createElement('a');
      link.download = fileName;
      const blob = new Blob([value], { type: contentType });
      link.href = URL.createObjectURL(blob);
      link.click();
    }
  }

  toDownloadLink(link: string): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http
        .get(link, {
          observe: 'response',
          responseType: 'blob' as 'json',
        })
        .pipe(
          map((response: any) => {
            let body = response.body;
            let dataType = body.type;
            let headers = response.headers;
            let filename = headers.get('content-disposition').split(';')[1].split('=')[1].replace(/"/g, '');
            let binaryData = [];
            binaryData.push(body);
            let downloadLink = this.document.createElement('a');
            downloadLink.href = URL.createObjectURL(new Blob(binaryData, { type: dataType }));
            downloadLink.setAttribute('download', filename);
            return downloadLink;
          })
        );
    }
  }

  delete(fileUpload: FileUpload): Observable<any> {
    const url = `${this.basePath}/delete-by-id?id=${fileUpload.id}`;
    return this.http.delete<any>(url, {});
  }

  createFormGroup(fileUpload: FileUpload): FormGroup {
    return this.formBuilder.group({
      id: new FormControl(fileUpload.id, []),
      file: new FormControl(null, [Validators.required]),
    });
  }

  findAll(criteria: FileUploadSearchCriteria, pageNumber: number, pageSize: number): Observable<Page<FileUpload>> {
    const url = `${this.basePath}/find-all?page=${pageNumber - 1}&size=${pageSize}&sort=uploadDate,DESC`;
    return this.http.post<Page<FileUpload>>(url, criteria);
  }

  static isImage(contentType?: string): boolean {
    return contentType?.includes('image/');
  }

  static isPdf(contentType?: string): boolean {
    return contentType === 'application/pdf';
  }
}
