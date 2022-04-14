import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Label, Fee, FeeManualForm, FeeSearchCriteria } from '../models/fee';
import { Page } from '@core/models/page';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class FeeService {
  backendUrl: string;
  constructor(private http: HttpClient, private configService: ConfigInitService) {
    this.backendUrl = `${this.configService.getConfig()['BACKEND_URL']}`;
  }

  search(criteria: FeeSearchCriteria, pageNumber: number, pageSize: number): Observable<Page<Fee>> {
    return this.http.post<Page<Fee>>(
      `${this.backendUrl}/api/fee/search?page=${pageNumber - 1}&size=${pageSize}&sort=date,DESC`,
      criteria
    );
  }

  updateTag(feeIds: string[], tag: Label): Observable<Fee[]> {
    return this.http.post<Fee[]>(`${this.backendUrl}/api/fee/update-tag?tag=${tag.name}`, feeIds);
  }

  updatePrice(id: string, priceHVat: number, vat: number): Observable<Fee> {
    return this.http.post<Fee>(
      `${
        this.configService.getConfig()['BACKEND_URL']
      }/api/fee/update-price?id=${id}&priceHVat=${priceHVat}&vat=${vat}`,
      {}
    );
  }

  removeAttachment(feeId: string, attachmentId: string): Observable<Fee> {
    return this.http.post<Fee>(
      `${
        this.configService.getConfig()['BACKEND_URL']
      }/api/fee/remove-attachment?id=${feeId}&attachmentId=${attachmentId}`,
      {}
    );
  }

  manualSubmit(manualSubmitForm: FeeManualForm): Observable<Fee> {
    let formData = new FormData();
    manualSubmitForm.files.forEach((file) => formData.append('files', file));
    formData.append('subject', manualSubmitForm.subject);
    formData.append('body', manualSubmitForm.body);
    return this.http.post<Fee>(`${this.backendUrl}/api/fee/manual-submit`, formData);
  }

  delete(fee: Fee) {
    return this.http.delete<void>(`${this.backendUrl}/api/fee?id=${fee.id}`, {});
  }

  findById(id: string): Observable<Fee> {
    return this.http.post<Fee>(`${this.backendUrl}/api/fee/find-by-id?id=${id}`, {});
  }
}
