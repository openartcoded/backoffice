import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private configService: ConfigInitService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    this.baseUrl = configService.getConfig()['BACKEND_URL'] + '/api/pdf';
  }

  public split(file: File): void {
    if (isPlatformBrowser(this.platformId)) {
      let formData = new FormData();
      formData.append('pdf', file);
      this.http
        .post(`${this.baseUrl}/split`, formData, {
          observe: 'response',
          responseType: 'blob' as 'json',
        })
        .subscribe((response: any) => {
          let body = response.body;
          let dataType = body.type;
          let headers = response.headers;
          let filename = headers.get('content-disposition').split(';')[1].split('=')[1].replace(/"/g, '');
          let binaryData = [];
          binaryData.push(body);
          let downloadLink = this.document.createElement('a');
          downloadLink.href = URL.createObjectURL(new Blob(binaryData, { type: dataType }));
          downloadLink.setAttribute('download', filename);
          this.document.body.appendChild(downloadLink);
          downloadLink.click();
        });
    }
  }
  public rotate(id: string, rotation: number) : Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/rotate?rotation=${rotation}&id=${id}`, {});
  }
}
