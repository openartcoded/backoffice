import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../models/page';
import {
  AdministrativeDocument,
  AdministrativeDocumentForm,
  AdministrativeDocumentSearchCriteria,
} from '@core/models/administrative-document';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class AdministrativeDocumentService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    configService: ConfigInitService,
  ) {
    this.baseUrl = `${configService.getConfig()['BACKEND_URL']}/api/administrative-document`;
  }

  search(
    criteria: AdministrativeDocumentSearchCriteria,
    pageNumber: number,
    pageSize: number,
  ): Observable<Page<AdministrativeDocument>> {
    return this.http.post<Page<AdministrativeDocument>>(
      `${this.baseUrl}/search?page=${pageNumber - 1}&size=${pageSize}&sort=dateCreation,DESC`,
      criteria,
    );
  }
  findByIds(ids: string[]): Observable<AdministrativeDocument[]> {
    const params = new URLSearchParams();
    for (const id of ids) {
      params.append('id', id);
    }
    return this.http.post<AdministrativeDocument[]>(`${this.baseUrl}/find-by-ids?${params.toString()}`, {});
  }
  save(submitForm: AdministrativeDocumentForm): Observable<any> {
    let formData = new FormData();
    formData.append('document', submitForm.document);
    formData.append('title', submitForm.title);
    formData.append('id', submitForm.id);
    formData.append('description', submitForm.description);
    formData.append('tags', submitForm.tags.join(','));
    return this.http.post<any>(`${this.baseUrl}/save`, formData);
  }

  delete(ad: AdministrativeDocument) {
    return this.http.delete<void>(`${this.baseUrl}?id=${ad.id}`, {});
  }
  toggleBookmarked(id: string) {
    return this.http.post<void>(`${this.baseUrl}/toggle-bookmarked?id=${id}`, {});
  }
  findById(id: string): Observable<AdministrativeDocument> {
    return this.http.post<AdministrativeDocument>(`${this.baseUrl}/find-by-id?id=${id}`, {});
  }
}
