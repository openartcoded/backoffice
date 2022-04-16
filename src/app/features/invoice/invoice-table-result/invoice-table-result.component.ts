import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
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
import { CurrentBilltoComponent } from '@feature/invoice/current-billto/current-billto.component';
import { TemplateComponent } from '@feature/invoice/template/template.component';
import { Page } from '@core/models/page';
import { ToastService } from '@core/service/toast.service';

@Component({
  selector: 'app-invoice-table-result',
  templateUrl: './invoice-table-result.component.html',
  styleUrls: ['./invoice-table-result.component.scss'],
})
export class InvoiceTableResultComponent implements OnInit, OnApplicationEvent {
  invoices: Page<Invoice>;
  activeDossier: Dossier;
  pageSize: number = 5;

  reloadSummary: boolean;

  @Input()
  logicalDelete: boolean;
  @Input()
  archived: boolean;

  constructor(
    private invoiceService: InvoiceService,
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRefService: WindowRefService,
    private toastService: ToastService,
    private notificationService: NotificationService,
    private dossierService: DossierService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.dossierService.activeDossier().subscribe((dt) => (this.activeDossier = dt));
    this.notificationService.subscribe(this);
    this.load();
  }

  load(event: number = 1) {
    this.invoiceService
      .search(this.archived, this.logicalDelete, event, this.pageSize)
      .subscribe((invoices) => (this.invoices = invoices));
  }

  download(invoice: Invoice): void {
    this.fileService.findById(invoice.invoiceUploadId).subscribe((f) => this.fileService.download(f));
  }

  async openModal(invoice: Invoice) {
    const currentBillTo = await this.invoiceService.getCurrentBillTo().toPromise();
    const ngbModalRef = this.modalService.open(InvoiceDetailComponent, {
      size: 'xl',
    });
    ngbModalRef.componentInstance.invoice = invoice;
    ngbModalRef.componentInstance.templates$ = this.invoiceService.listTemplates();
    ngbModalRef.componentInstance.currentBillTo = currentBillTo;
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
      let areYouSureYouWantToDeleteTheInvoice = `Are you sure you want to delete the invoice (${
        this.logicalDelete ? 'REALLY' : 'logically'
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
          this.reloadSummary = true;
          setTimeout(() => {
            this.reloadSummary = false;
          }, 100);
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
      ngbModalRef.componentInstance.title = upl.metadata?.originalFilename;
    });
  }

  handle(events: ArtcodedNotification[]) {
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

  billToModal() {
    this.invoiceService.getCurrentBillTo().subscribe((currentBillTo) => {
      const ngbModalRef = this.modalService.open(CurrentBilltoComponent, {
        size: 'xl',
      });
      ngbModalRef.componentInstance.currentBillTo = currentBillTo;
      ngbModalRef.componentInstance.onSaveCurrentBillTo.subscribe(async (updatedCurrentBillTo) => {
        ngbModalRef.close();
        await this.invoiceService.saveCurrentBillTo(updatedCurrentBillTo).toPromise();
      });
    });
  }

  templateModal() {
    const ngbModalRef = this.modalService.open(TemplateComponent, {
      size: 'lg',
    });
    ngbModalRef.componentInstance.templates$ = this.invoiceService.listTemplates();
    ngbModalRef.componentInstance.onSaveTemplate.subscribe(async (formData) => {
      ngbModalRef.close();
      await this.invoiceService.addTemplate(formData).toPromise();
    });
    ngbModalRef.componentInstance.onDeleteTemplate.subscribe(async (template) => {
      ngbModalRef.close();
      await this.invoiceService.deleteTemplate(template).toPromise();
    });
  }
}
