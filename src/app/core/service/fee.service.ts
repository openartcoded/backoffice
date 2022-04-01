import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultPriceForTag, Fee, FeeManualForm, FeeSearchCriteria, FeeTag } from '../models/fee';
import { Page } from '@core/models/page';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class FeeService {
  constructor(private http: HttpClient, private configService: ConfigInitService) {}

  search(criteria: FeeSearchCriteria, pageNumber: number, pageSize: number): Observable<Page<Fee>> {
    return this.http.post<Page<Fee>>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/fee/search?page=${
        pageNumber - 1
      }&size=${pageSize}&sort=date,DESC`,
      criteria
    );
  }

  updateTag(feeIds: string[], tag: FeeTag): Observable<Fee[]> {
    return this.http.post<Fee[]>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/fee/update-tag?tag=${FeeTag[tag]}`,
      feeIds
    );
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
    return this.http.post<Fee>(`${this.configService.getConfig()['BACKEND_URL']}/api/fee/manual-submit`, formData);
  }

  delete(fee: Fee) {
    return this.http.delete<void>(`${this.configService.getConfig()['BACKEND_URL']}/api/fee?id=${fee.id}`, {});
  }

  findById(id: string): Observable<Fee> {
    return this.http.post<Fee>(`${this.configService.getConfig()['BACKEND_URL']}/api/fee/find-by-id?id=${id}`, {});
  }

  updateDefaultPriceForTags(list: DefaultPriceForTag[]): Observable<void> {
    return this.http.post<void>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/fee/update-default-price-for-tag`,
      list
    );
  }

  findAllDefaultPriceForTag(): Observable<DefaultPriceForTag[]> {
    return this.http.get<DefaultPriceForTag[]>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/fee/default-price-for-tag`
    );
  }
}
