import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Dossier, DossierSummary } from '../models/dossier';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs/operators';
import { ConfigInitService } from '@init/config-init.service';
import { FileService } from './file.service';
import { Direction, Page, SortCriteria } from '@core/models/page';

@Injectable({
  providedIn: 'root',
})
export class DossierService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any,
    private configService: ConfigInitService,
    private fileService: FileService,
    private http: HttpClient
  ) { }

  findAll(closed: boolean): Observable<Dossier[]> {
    return this.http.post<Dossier[]>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/find-all?closed=${closed}`,
      {}
    );
  }

  findAllWithPage(
    closed: boolean,
    pageNumber: number,
    pageSize: number,
    sortCriteria: SortCriteria
  ): Observable<Page<Dossier>> {
    const direction = Direction[sortCriteria.direction];

    return this.http.post<Page<Dossier>>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/find-all-paged?closed=${closed}&page=${pageNumber - 1
      }&size=${pageSize}&sort=${sortCriteria.property},${direction}`,
      {}
    );
  }

  findById(id: string): Observable<Dossier[]> {
    return this.http.post<Dossier[]>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/find-by-id?id=${id}`,
      {}
    );
  }

  size(id: string): Observable<number> {
    return this.http.post<number>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/size?id=${id}`,
      {}
    );
  }

  fromPrevious(): Observable<Dossier> {
    return this.http.post<Dossier>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/new-from-previous`,
      {}
    );
  }

  import(file: File): Observable<void> {
    let formData = new FormData();
    formData.append('zip', file);
    return this.http.post<void>(`${this.configService.getConfig()['BACKEND_URL']}/api/dossier/import`, formData);
  }

  importExample() {
    const url = `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/import-example`;
    this.fileService.downloadLink(url);
  }

  getSummary(id: string): Observable<DossierSummary> {
    return this.http.post<DossierSummary>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/summary?id=${id}`,
      {}
    );
  }
  getAllSummaries(closed: boolean): Observable<DossierSummary[]> {
    return this.http.post<DossierSummary[]>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/find-all-summaries?closed=${closed}`,
      {}
    );
  }
  getSummaries(ids: string[]): Observable<DossierSummary[]> {
    const params = new URLSearchParams();
    for (const id of ids) {
      params.append('id', id);
    }
    return this.http.post<DossierSummary[]>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/summaries?${params.toString()}`,
      {}
    );
  }

  async generateSummary(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      const downloadLink = await firstValueFrom(
        this.http
          .get(`${this.configService.getConfig()['BACKEND_URL']}/api/dossier/generate-summary?id=${id}`, {
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
          )
      );
      this.document.body.appendChild(downloadLink);
      downloadLink.click();
    }
  }

  findByFeeId(tagId: string): Observable<Dossier[]> {
    return this.http.post<Dossier[]>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/find-by-fee-id?id=${tagId}`,
      {}
    );
  }

  processFees(feeIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.configService.getConfig()['BACKEND_URL']}/api/dossier/process-fees`, feeIds);
  }

  removeFee(feeId: string): Observable<Dossier> {
    return this.http.post<Dossier>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/remove-fee?feeId=${feeId}`,
      {}
    );
  }

  newDossier(dossier: Dossier): Observable<Dossier> {
    return this.http.post<Dossier>(`${this.configService.getConfig()['BACKEND_URL']}/api/dossier/new-dossier`, dossier);
  }

  updateDossier(dossier: Dossier): Observable<Dossier> {
    return this.http.post<Dossier>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/update-dossier`,
      dossier
    );
  }

  recallForModification(dossier: Dossier): Observable<Dossier> {
    return this.http.post<Dossier>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/recall-for-modification`,
      dossier
    );
  }

  closeActiveDossier(): Observable<Dossier> {
    return this.http.post<Dossier>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/close-active-dossier`,
      {}
    );
  }

  activeDossier(): Observable<Dossier> {
    return this.http.post<Dossier>(`${this.configService.getConfig()['BACKEND_URL']}/api/dossier/active-dossier`, {});
  }

  processInvoice(id: string) {
    return this.http.post<void>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/process-invoice?id=${id}`,
      {}
    );
  }

  removeInvoice(id: string): Observable<Dossier> {
    return this.http.post<Dossier>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/remove-invoice?id=${id}`,
      {}
    );
  }

  addDocumentToDossier(id: string) {
    return this.http.post<void>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/add-document?id=${id}`,
      {}
    );
  }

  removeDocument(id: string): Observable<Dossier> {
    return this.http.post<Dossier>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/dossier/remove-document?id=${id}`,
      {}
    );
  }

  deleteActiveDossier() {
    return this.http.delete<any>(`${this.configService.getConfig()['BACKEND_URL']}/api/dossier/active-dossier`, {});
  }
}
