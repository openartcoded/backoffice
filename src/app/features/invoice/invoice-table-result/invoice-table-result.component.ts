import { Component, HostListener, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
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
import { MailContextType, MailRequest } from '@core/models/mail';
import { User } from '@core/models/user';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { PersonalInfo } from '@core/models/personal.info';
@Component({
  selector: 'app-invoice-table-result',
  templateUrl: './invoice-table-result.component.html',
  styleUrls: ['./invoice-table-result.component.scss'],
  standalone: false,
})
export class InvoiceTableResultComponent implements OnInit, OnApplicationEvent {
  invoices: Page<Invoice>;
  activeDossier: Dossier;
  pageSize: number = 10;

  personalInfo?: PersonalInfo;

  sort: SortCriteria = {
    direction: Direction.DESC,
    property: 'dateCreation',
  };

  @Input()
  bookmarked: boolean;
  @Input()
  logicalDelete: boolean;
  @Input()
  user: User;
  get hasRoleAdmin(): boolean {
    return this.user.authorities.includes('ADMIN');
  }
  @Input()
  archived: boolean;

  clients: BillableClient[];
  ASC = Direction.ASC;
  DESC = Direction.DESC;

  @HostListener('document:keydown', ['$event'])
  topKey(event: KeyboardEvent) {
    if (event.ctrlKey && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      event.stopPropagation();
      this.newInvoice();
    }
  }
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
    private mailService: MailService,
    private personalInfoService: PersonalInfoService,
  ) {}

  ngOnInit() {
    this.dossierService.activeDossier().subscribe((dt) => (this.activeDossier = dt));
    this.notificationService.subscribe(this);
    this.personalInfoService.get().subscribe((p) => (this.personalInfo = p));
    this.load();
  }

  load(event: number = 1) {
    this.invoiceService
      .search(this.archived, this.logicalDelete, event, this.pageSize, this.sort, this.bookmarked)
      .subscribe((invoices) => {
        this.invoices = invoices;
      });
  }

  download(invoice: Invoice): void {
    this.fileService.findById(invoice.invoiceUploadId).subscribe((f) => this.fileService.download(f));
  }

  async sendMail(invoice: Invoice) {
    if (!this.hasRoleAdmin) {
      return;
    }
    const upload = await firstValueFrom(this.fileService.findById(invoice.invoiceUploadId));
    const context: Map<string, MailContextType> = new Map();
    context.set('Invoice Ref', invoice.invoiceNumber);
    context.set('Invoice N°', invoice.newInvoiceNumber);
    context.set('Client', invoice.billTo?.clientName);
    context.set('Period', invoice.invoiceTable[0]?.period);

    const ngbModalRef = this.modalService.open(MailFormComponent, {
      size: 'lg',
    });
    ngbModalRef.componentInstance.attachments = [upload];
    ngbModalRef.componentInstance.context = context;
    ngbModalRef.componentInstance.defaultSubject = `Invoice ${invoice.newInvoiceNumber || invoice.invoiceNumber}`;
    ngbModalRef.componentInstance.to = [invoice.billTo?.emailAddress];
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
      scrollable: true,
    });
    ngbModalRef.componentInstance.user = this.user;
    ngbModalRef.componentInstance.demoMode = this.personalInfo?.demoMode;
    ngbModalRef.componentInstance.invoice = invoice;
    ngbModalRef.componentInstance.templates = templates;
    ngbModalRef.componentInstance.clients = this.clients.filter((c) => !c.student);
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
  toggleBookmark($event: MouseEvent, invoice: Invoice) {
    $event.stopPropagation();
    this.invoiceService.toggleBookmarked(invoice.id).subscribe(() => {
      this.toastService.showSuccess('Bookmark toggled. Reload...');
      invoice.bookmarked = !invoice.bookmarked;
      const index = this.invoices.content.findIndex((d, idx) => d.id && d.id === invoice.id);
      if (index !== -1) {
        const newArray =
          this.bookmarked && !invoice.bookmarked
            ? this.invoices.content.filter((x) => x.id !== invoice.id)
            : this.invoices.content.map((item, i) => (i === index ? invoice : item));
        this.invoices.content = newArray;
      }
    });
  }
  makeCreditNote(invoice: Invoice) {
    this.invoiceService.makeCreditNote(invoice).subscribe((inv) => {
      this.toastService.showSuccess('Credit note created. Will be generated soon');
    });
  }

  newInvoiceFromTemplate(invoice: Invoice) {
    if (!this.hasRoleAdmin) {
      return;
    }
    this.invoiceService.newInvoiceFromTemplate(invoice).subscribe((data) => this.openModal(data));
  }

  newInvoice() {
    if (!this.hasRoleAdmin) {
      return;
    }
    this.invoiceService.newInvoice().subscribe((data) => this.openModal(data));
  }

  delete(invoice: Invoice) {
    if (!this.hasRoleAdmin) {
      return;
    }
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

  sendToPeppol(invoice: Invoice) {
    if (invoice.peppolStatus === 'NOT_SENT') {
      if (isPlatformBrowser(this.platformId)) {
        let confirm = `Are you sure you want to send this invoice to peppol?`;
        let resp = this.windowRefService.nativeWindow.confirm(confirm);
        if (resp) {
          this.invoiceService.sendToPeppol(invoice.id).subscribe(() => {
            this.load();
            this.toastService.showSuccess('peppol xml sent');
          });
        }
      }
    }
  }
  restore(invoice: Invoice) {
    if (!this.hasRoleAdmin) {
      return;
    }
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
    if (!this.hasRoleAdmin) {
      return;
    }
    if (isPlatformBrowser(this.platformId)) {
      if (this.windowRefService.nativeWindow.confirm('Process this invoice?')) {
        if (invoice.peppolStatus === 'NOT_SENT') {
          if (!this.windowRefService.nativeWindow.confirm("You didn't send the Peppol XML. Are you sure?")) {
            return;
          }
        }
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

  openXMLViewer(invoice: Invoice) {
    this.fileService.findById(invoice.invoiceUBLId).subscribe((upl) => {
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
    if (!this.hasRoleAdmin) {
      return;
    }
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
