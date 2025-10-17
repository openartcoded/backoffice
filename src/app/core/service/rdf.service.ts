import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class RdfService {
  baseUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private configService: ConfigInitService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    this.baseUrl = configService.getConfig()['BACKEND_URL'] + '/api/toolbox/public/rdf';
  }

  public getAllowedLanguages(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/allowed-languages`);
  }

  public getAllowedExtensions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/allowed-extensions`);
  }

  public modelToLang(model: string, langOfModel: string, lang: string): Observable<string> {
    let formData = new FormData();

    formData.append('model', model);
    formData.append('langOfModel', langOfModel);
    formData.append('lang', lang);

    return this.http.post(`${this.baseUrl}/model-to-lang`, formData, {
      responseType: 'text',
    });
  }

  public shaclValidation(modelFile: File, shaclFile: File): Observable<string> {
    let formData = new FormData();

    formData.append('modelFile', modelFile);
    formData.append('shaclFile', shaclFile);

    return this.http.post(`${this.baseUrl}/shacl-validation`, formData, {
      responseType: 'text',
    });
  }

  public fileToFile(file: File, lang: string): void {
    if (isPlatformBrowser(this.platformId)) {
      let formData = new FormData();
      formData.append('file', file);
      formData.append('lang', lang);
      this.http
        .post(`${this.baseUrl}/file-to-lang`, formData, {
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
}
