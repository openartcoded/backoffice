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

  constructor(private http: HttpClient, private configService: ConfigInitService) {
    this.basePath = `${configService.getConfig()['BACKEND_URL']}/api/billable-client`;
  }


  findByContractStatus(contractStatus: ContractStatus): Observable<BillableClient[]> {
    return this.http.get<BillableClient[]>(`${this.basePath}/find-by-contract-status?contractStatus=${ContractStatus[contractStatus]}`);
  }
  
  findAll(): Observable<BillableClient[]> {
    return this.http.get<BillableClient[]>(`${this.basePath}/find-all`);
  }

}
