import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice, InvoiceFreemarkerTemplate } from '@core/models/invoice';
import { Page } from '@core/models/page';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  basePath: string;

  constructor(private http: HttpClient, private configService: ConfigInitService) {
    this.basePath = `${configService.getConfig()['BACKEND_URL']}/api/invoice`;
  }

  search(
    archived: boolean = false,
    logicalDelete: boolean = false,
    pageNumber: number,
    pageSize: number
  ): Observable<Page<Invoice>> {
    return this.http.post<Page<Invoice>>(
      `${this.basePath}/page?archived=${archived}&logical=${logicalDelete}&page=${pageNumber - 1}&size=${pageSize}`,
      {}
    );
  }

  findAll(archived: boolean = false, logicalDelete: boolean = false): Observable<Invoice[]> {
    return this.http.post<Invoice[]>(`${this.basePath}/find-all?archived=${archived}&logical=${logicalDelete}`, {});
  }

  newInvoiceFromTemplate(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.basePath}/from-template?id=${invoice.id}`, {});
  }

  save(data: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.basePath}/save`, data);
  }

  uploadedManually(invoice: Invoice, manualUploadFile: File): Observable<Invoice> {
    let formData = new FormData();
    formData.append('id', invoice.id);
    formData.append('manualUploadFile', manualUploadFile);
    return this.http.post<Invoice>(`${this.basePath}/manual-upload`, formData);
  }

  newInvoice(): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.basePath}/new`, {});
  }

  delete(invoice: Invoice, logicalDelete: boolean = true) {
    return this.http.delete<Invoice>(`${this.basePath}?id=${invoice.id}&logical=${logicalDelete}`, {});
  }

  deleteTemplate(template: InvoiceFreemarkerTemplate) {
    return this.http.delete<any>(`${this.basePath}/delete-template?id=${template.id}`, {});
  }

  addTemplate(formData: FormData): Observable<InvoiceFreemarkerTemplate> {
    return this.http.post<InvoiceFreemarkerTemplate>(`${this.basePath}/add-template`, formData);
  }

  restore(id: string) {
    return this.http.post<any>(`${this.basePath}/restore?id=${id}`, {});
  }

  listTemplates(): Observable<InvoiceFreemarkerTemplate[]> {
    return this.http.get<InvoiceFreemarkerTemplate[]>(`${this.basePath}/list-templates`, {});
  }

  findById(id: string) {
    return this.http.post<Invoice>(`${this.basePath}/find-by-id?id=${id}`, {});
  }
}
