import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Label, Fee, FeeManualForm, FeeSearchCriteria, FeeSummary } from '../models/fee';
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

    toggleBookmarked(id: string) {
        return this.http.post<void>(`${this.backendUrl}/api/fee/toggle-bookmarked?id=${id}`, {});
    }

    updatePrice(id: string, priceHVat: number, vat: number): Observable<Fee> {
        return this.http.post<Fee>(
            `${this.backendUrl}/api/fee/update-price?id=${id}&priceHVat=${priceHVat}&vat=${vat}`,
            {}
        );
    }

    removeAttachment(feeId: string, attachmentId: string): Observable<Fee> {
        return this.http.post<Fee>(
            `${this.backendUrl}/api/fee/remove-attachment?id=${feeId}&attachmentId=${attachmentId}`,
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

    findByIds(ids: string[]): Observable<Fee[]> {
        const params = new URLSearchParams();
        for (const id of ids) {
            params.append('id', id);
        }
        return this.http.post<Fee[]>(`${this.backendUrl}/api/fee/find-by-ids?${params.toString()}`, {});
    }

    summaries(): Observable<FeeSummary[]> {
        return this.http.post<FeeSummary[]>(`${this.backendUrl}/api/fee/summaries`, {});
    }
}
