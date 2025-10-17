import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigInitService } from '@init/config-init.service';
import { BillableClient, ContractStatus } from '@core/models/billable-client';

@Injectable({
  providedIn: 'root',
})
export class BillableClientService {
  basePath: string;

  constructor(
    private http: HttpClient,
    configService: ConfigInitService,
  ) {
    this.basePath = `${configService.getConfig()['BACKEND_URL']}/api/billable-client`;
  }

  findByContractStatus(contractStatus: ContractStatus): Observable<BillableClient[]> {
    return this.http.get<BillableClient[]>(
      `${this.basePath}/find-by-contract-status?contractStatus=${ContractStatus[contractStatus]}`,
    );
  }

  findAll(): Observable<BillableClient[]> {
    return this.http.get<BillableClient[]>(`${this.basePath}/find-all`);
  }

  save(client: BillableClient): Observable<BillableClient> {
    return this.http.post<BillableClient>(`${this.basePath}/save`, client);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.basePath}?id=${id}`);
  }

  upload(id: string, file: File): Observable<void> {
    let formData = new FormData();
    formData.append('document', file);
    formData.append('id', id);
    return this.http.post<void>(`${this.basePath}/upload`, formData);
  }

  deleteUpload(id: string, uploadId: string): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/upload?id=${id}&uploadId=${uploadId}`);
  }
}
