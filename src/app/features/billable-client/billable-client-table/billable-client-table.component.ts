import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BillableClient } from '@core/models/billable-client';
import { BillableClientService } from '@core/service/billable-client.service';
import { ToastService } from '@core/service/toast.service';
import { WindowRefService } from '@core/service/window.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BillableClientDetailComponent } from '../billable-client-detail/billable-client-detail.component';

@Component({
  selector: 'app-billable-client-table',
  templateUrl: './billable-client-table.component.html',
  styleUrls: ['./billable-client-table.component.scss']
})
export class BillableClientTableComponent implements OnInit {

  clients: BillableClient[];
  constructor(private billableClientService: BillableClientService,
    private titleService: Title,
    private toastService: ToastService,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRefService: WindowRefService,
    private modalService: NgbModal,
    ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Clients');
    this.metaService.updateTag({
      name: 'description',
      content: 'Manage Clients',
    });
    this.load();
  }

  load(){
    this.billableClientService.findAll().subscribe(c => this.clients = c);
  }

  addOrEdit(client?: BillableClient) {
      const ngbModalRef = this.modalService.open(BillableClientDetailComponent, {
        size: 'xl',
      });
      ngbModalRef.componentInstance.client = client || {} as BillableClient;
      ngbModalRef.componentInstance.onSaveClient.subscribe(async (client) => {
        ngbModalRef.close();
        this.billableClientService.save(client).subscribe(client =>{
          this.toastService.showSuccess('Client updated');
          this.load();

        })
      });
  }

  delete(client: BillableClient) {
    if (isPlatformBrowser(this.platformId)) {
      if (this.windowRefService.nativeWindow.confirm('Are you sure you want to delete this client?')) {
        this.billableClientService.delete(client.id).subscribe((data) => {
          this.load();
          this.toastService.showSuccess('Client deleted');
        });
      }
    }
  }

}
