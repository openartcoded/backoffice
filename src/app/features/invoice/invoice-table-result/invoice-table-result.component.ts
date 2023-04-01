import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Invoice } from '@core/models/invoice';
import { InvoiceService } from '@core/service/invoice.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '@core/service/file.service';
import { InvoiceDetailComponent } from '../invoice-detail/invoice-detail.component';
import { DossierService } from '@core/service/dossier.service';
import { Dossier } from '@core/models/dossier';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';
import { OnApplicationEvent, RegisteredEvent } from '@core/interface/on-application-event';
import { NotificationService } from '@core/service/notification.service';
import { ArtcodedNotification } from '@core/models/artcoded.notification';
import { TemplateComponent } from '@feature/invoice/template/template.component';
import { Page } from '@core/models/page';
import { ToastService } from '@core/service/toast.service';
import { firstValueFrom } from 'rxjs';
import { BillableClientService } from '@core/service/billable-client.service';
import { BillableClient, ContractStatus } from '@core/models/billable-client';
import { SortCriteria, Direction } from '@core/models/page';
import { MailFormComponent } from '@shared/mail-form/mail-form.component';
import { MailService } from '@core/service/mail.service';
import { MailRequest } from '@core/models/mail-request';
@Component({
  selector: 'app-invoice-table-result',
  templateUrl: './invoice-table-result.component.html',
  styleUrls: ['./invoice-table-result.component.scss'],
})
export class InvoiceTableResultComponent implements OnInit, OnApplicationEvent {
  invoices: Page<Invoice>;
  activeDossier: Dossier;
  pageSize: number = 5;

  sort: SortCriteria = {
    direction: Direction.DESC,
    property: 'dateCreation',
  };

  @Input()
  logicalDelete: boolean;
  @Input()
  archived: boolean;

  clients: BillableClient[];
  ASC = Direction.ASC;
  DESC = Direction.DESC;

  constructor(
    private invoiceService: InvoiceService,
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRefService: WindowRefService,
    private billableClientService: BillableClientService,
    private toastService: ToastService,
    private notificationService: NotificationService,
    private dossierService: DossierService,
    private fileService: FileService,
    private mailService: MailService
  ) { }

  ngOnInit() {
    this.dossierService.activeDossier().subscribe((dt) => (this.activeDossier = dt));
    this.notificationService.subscribe(this);
    this.load();
  }

  load(event: number = 1) {
    this.invoiceService
      .search(this.archived, this.logicalDelete, event, this.pageSize, this.sort)
      .subscribe((invoices) => {
        this.invoices = invoices;
      });
  }

  download(invoice: Invoice): void {
    this.fileService.findById(invoice.invoiceUploadId).subscribe((f) => this.fileService.download(f));
  }

  async sendMail(invoice: Invoice) {
    const upload = await firstValueFrom(this.fileService.findById(invoice.invoiceUploadId));
    const ngbModalRef = this.modalService.open(MailFormComponent, {
      size: 'md',
    });
    ngbModalRef.componentInstance.attachments = [upload];
    ngbModalRef.componentInstance.sendMail.subscribe(async (mailRequest: MailRequest) => {
      ngbModalRef.close();
      await firstValueFrom(this.mailService.send(mailRequest));
      this.toastService.showSuccess('Mail will be send');
    });
  }

  async openModal(invoice: Invoice) {
    this.clients = await firstValueFrom(this.billableClientService.findByContractStatus(ContractStatus.ONGOING));
    const templates = await firstValueFrom(this.invoiceService.listTemplates());
    const ngbModalRef = this.modalService.open(InvoiceDetailComponent, {
      size: 'xl',
    });
    ngbModalRef.componentInstance.invoice = invoice;
    ngbModalRef.componentInstance.templates = templates;
    ngbModalRef.componentInstance.clients = this.clients;
    ngbModalRef.componentInstance.onSaveInvoice.subscribe((invoiceForm) => {
      ngbModalRef.close();
      this.invoiceService.save(invoiceForm.invoice).subscribe((inv) => {
        if (inv.uploadedManually) {
          this.invoiceService.uploadedManually(inv, invoiceForm.manualUploadFile).subscribe((d) => {
            //this.load();
          });
        }
        this.toastService.showSuccess('Invoice created. Will be generated soon');
      });
    });
  }

  newInvoiceFromTemplate(invoice: Invoice) {
    this.invoiceService.newInvoiceFromTemplate(invoice).subscribe((data) => this.openModal(data));
  }

  newInvoice() {
    this.invoiceService.newInvoice().subscribe((data) => this.openModal(data));
  }

  delete(invoice: Invoice) {
    if (isPlatformBrowser(this.platformId)) {
      let areYouSureYouWantToDeleteTheInvoice = `Are you sure you want to delete the invoice (${this.logicalDelete ? 'REALLY' : 'logically'
        }) ?`;
      let resp = this.windowRefService.nativeWindow.confirm(areYouSureYouWantToDeleteTheInvoice);
      if (resp) {
        this.invoiceService.delete(invoice, !(this.logicalDelete || false)).subscribe((data) => {
          this.load();
        });
      }
    }
  }

  restore(invoice: Invoice) {
    if (isPlatformBrowser(this.platformId)) {
      let areYouSureYouWantToDeleteTheInvoice = `Are you sure you want to restore this invoice?`;
      let resp = this.windowRefService.nativeWindow.confirm(areYouSureYouWantToDeleteTheInvoice);
      if (resp) {
        this.invoiceService.restore(invoice.id).subscribe((data) => {
          this.load();
        });
      }
    }
  }

  process(invoice: Invoice) {
    if (isPlatformBrowser(this.platformId)) {
      if (this.windowRefService.nativeWindow.confirm('Process this invoice?')) {
        this.dossierService.processInvoice(invoice.id).subscribe((dt) => {
          this.load();
        });
      }
    }
  }

  openPdfViewer(invoice: Invoice) {
    this.fileService.findById(invoice.invoiceUploadId).subscribe((upl) => {
      const ngbModalRef = this.modalService.open(PdfViewerComponent, {
        size: 'xl',
        scrollable: true,
      });
      ngbModalRef.componentInstance.pdf = upl;
      ngbModalRef.componentInstance.title = upl?.originalFilename;
    });
  }

  handle(_events: ArtcodedNotification[]) {
    this.load();
  }

  ngOnDestroy(): void {
    this.notificationService.unsubscribe(this);
  }

  shouldHandle(event: ArtcodedNotification): boolean {
    return !event.seen && event.type === RegisteredEvent.NEW_INVOICE;
  }

  shouldMarkEventAsSeenAfterConsumed(): boolean {
    return true;
  }

  templateModal() {
    this.invoiceService.listTemplates().subscribe((templates) => {
      const ngbModalRef = this.modalService.open(TemplateComponent, {
        size: 'lg',
      });
      ngbModalRef.componentInstance.templates = templates;
      ngbModalRef.componentInstance.onSaveTemplate.subscribe(async (formData) => {
        ngbModalRef.close();
        await firstValueFrom(this.invoiceService.addTemplate(formData));
        this.toastService.showSuccess('Will add the template');
      });
      ngbModalRef.componentInstance.onDeleteTemplate.subscribe(async (template) => {
        ngbModalRef.close();
        await firstValueFrom(this.invoiceService.deleteTemplate(template));
        this.toastService.showSuccess('Will delete the template');
      });
    });
  }

  setSort(propertyName: string) {
    this.sort = {
      property: propertyName,
      direction: this.sort.direction === Direction.ASC ? Direction.DESC : Direction.ASC,
    };
    this.load();
  }
}
