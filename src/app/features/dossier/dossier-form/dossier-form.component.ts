import { Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Dossier, TvaAdvancePayment } from '@core/models/dossier';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Fee, Label } from '@core/models/fee';
import { FeeService } from '@core/service/fee.service';
import { formatDate } from '@angular/common';
import { Invoice } from '@core/models/invoice';
import { InvoiceService } from '@core/service/invoice.service';
import { FeeDetailComponent } from '@feature/fee/fee-detail/fee-detail.component';
import { InvoiceDetailComponent } from '@feature/invoice/invoice-detail/invoice-detail.component';
import { DateUtils } from '@core/utils/date-utils';
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { BillableClient } from '@core/models/billable-client';
import { BillableClientService } from '@core/service/billable-client.service';
import { AdministrativeDocumentService } from '@core/service/administrative-document.service';
import { AdministrativeDocument } from '@core/models/administrative-document';
import { DocumentEditorComponent } from '@feature/administrative-document/document-editor/document-editor.component';
import { FileService } from '@core/service/file.service';

@Component({
  selector: 'app-dossier-form',
  templateUrl: './dossier-form.component.html',
  styleUrls: ['./dossier-form.component.scss'],
})
export class DossierFormComponent implements OnInit, OnDestroy {
  dossierUpdatedSubscription: Subscription;
  @Input()
  size$: Observable<number>;

  @Input()
  dossierUpdatedEmitter: EventEmitter<Dossier>;
  @Input()
  dossier: Dossier;
  @Input()
  recallForModification: boolean = false;
  @Input()
  labels: Label[];
  searchExpense: string;

  vatTotal: number = 0;
  invoiceTotalExclVat: number = 0;
  feeTotalExclVat: number = 0;
  feeTotalVat: number = 0;

  @Output()
  submitted: EventEmitter<Dossier> = new EventEmitter<Dossier>();
  @Output()
  feeRemoved: EventEmitter<Fee> = new EventEmitter<Fee>();
  @Output()
  invoiceRemoved: EventEmitter<Invoice> = new EventEmitter<Invoice>();
  @Output()
  documentRemoved: EventEmitter<AdministrativeDocument> = new EventEmitter<AdministrativeDocument>();

  @Output()
  onDownloadSummary: EventEmitter<Dossier> = new EventEmitter<Dossier>();

  dossierForm: UntypedFormGroup;

  expenses: Fee[];
  documents: AdministrativeDocument[];
  filteredExpenses: Fee[];
  clients: BillableClient[];

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private feeService: FeeService,
    private fileService: FileService,
    private modalService: NgbModal,
    private invoiceService: InvoiceService,
    private documentService: AdministrativeDocumentService,
    private clientService: BillableClientService,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnDestroy(): void {
    this.dossierUpdatedSubscription?.unsubscribe();
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.dossierForm = this.createFormGroup();
    this.clients = await firstValueFrom(this.clientService.findAll());
    await this.loadFees();
    await this.loadInvoices();
    await this.loadDocuments();
    if (this.dossierUpdatedSubscription) {
      this.dossierUpdatedSubscription.unsubscribe();
    }
    if (this.dossierUpdatedEmitter) {
      this.dossierUpdatedEmitter.subscribe(async (d) => {
        this.dossier = d;
        await this.load();
      });
    }
  }

  async loadFees() {
    this.feeTotalVat = 0;
    this.feeTotalExclVat = 0;
    if (this.dossier?.feeIds?.length) {
      const fees = await firstValueFrom(this.feeService.findByIds(this.dossier.feeIds));

      for (let fee of fees) {
        this.feeTotalVat += fee.vat || 0;
        this.feeTotalExclVat += fee.priceHVAT || 0;
      }
      this.expenses = fees;
      this.filteredExpenses = fees;
      this.filteredExpenses.sort((e1, e2) => new Date(e2.date).getTime() - new Date(e1.date).getTime());
    } else {
      this.expenses = [];
      this.filteredExpenses = [];
    }
  }
  async loadDocuments() {
    if (this.dossier?.documentIds?.length) {
      this.documents = await firstValueFrom(this.documentService.findByIds(this.dossier.documentIds));
    } else {
      this.documents = [];
    }
  }

  async loadInvoices() {
    this.vatTotal = 0;
    this.invoiceTotalExclVat = 0;
    if (this.dossier?.invoiceIds?.length) {
      const invoices = await firstValueFrom(this.invoiceService.findByIds(this.dossier.invoiceIds));
      for (let invoice of invoices) {
        this.vatTotal += invoice.taxes;
        this.invoiceTotalExclVat += invoice.subTotal;
      }
      this.dossier.invoices = invoices;
      this.dossier.invoices.sort(
        (e1, e2) => new Date(e2.dateOfInvoice).getTime() - new Date(e1.dateOfInvoice).getTime(),
      );
    } else {
      this.dossier.invoices = [];
    }
  }

  createFormGroup(): UntypedFormGroup {
    return this.fb.group({
      dossierId: new UntypedFormControl({ value: this.dossier.id, disabled: true }, []),
      tvaDue: new UntypedFormControl(
        {
          value: this.dossier.tvaDue,
          disabled: this.dossier.closed && !this.recallForModification,
        },
        [],
      ),
      advancePayments: this.fb.array(this.createAdvancePayments(this.dossier.advancePayments)),
      dossierName: new UntypedFormControl({ value: this.dossier.name, disabled: this.dossier.closed }, [
        Validators.minLength(5),
        Validators.maxLength(20),
      ]),
      dossierDescription: new UntypedFormControl({ value: this.dossier.description, disabled: this.dossier.closed }, [
        Validators.maxLength(1024),
      ]),
      creationDate: new UntypedFormControl(
        {
          value: this.dossier.creationDate ? formatDate(this.dossier.creationDate, 'dd/MM/yyyy HH:mm', 'de') : null,
          disabled: true,
        },
        [],
      ),
      updatedDate: new UntypedFormControl(
        {
          value: this.dossier.updatedDate ? formatDate(this.dossier.updatedDate, 'dd/MM/yyyy HH:mm', 'de') : null,
          disabled: true,
        },
        [],
      ),
      dossierClosed: new UntypedFormControl({ value: this.dossier.closed, disabled: true }, []),

      closedDate: new UntypedFormControl(
        {
          value: this.dossier.closedDate ? formatDate(this.dossier.closedDate, 'dd/MM/yyyy HH:mm', 'de') : null,
          disabled: true,
        },
        [],
      ),
      dossierRecalledForModification: new UntypedFormControl(
        {
          value: this.dossier.recalledForModification,
          disabled: true,
        },
        [],
      ),

      dossierRecalledForModificationDate: new UntypedFormControl(
        {
          value: this.dossier.closedDate
            ? formatDate(this.dossier.recalledForModificationDate, 'dd/MM/yyyy HH:mm', 'de')
            : null,
          disabled: true,
        },
        [],
      ),
    });
  }

  get advancePayments(): UntypedFormArray {
    return this.dossierForm.get('advancePayments') as UntypedFormArray;
  }

  totalAttachments() {
    return (
      this?.expenses.map((f) => f?.attachmentIds?.length).reduce((a, b) => a + b, 0) + this?.dossier?.invoiceIds?.length
    );
  }

  send() {
    this.submitted.emit({
      id: this.dossier.id,
      closed: this.dossier.closed,
      recalledForModification: this.recallForModification,
      tvaDue: this.dossierForm.controls.tvaDue.value,
      advancePayments: this.advancePayments?.controls?.map((c) => {
        return {
          datePaid: DateUtils.getDateFromInput(c.get('datePaid').value),
          advance: c.get('advance').value,
        } as TvaAdvancePayment;
      }),
      name: this.dossierForm.controls.dossierName.value,
      description: this.dossierForm.controls.dossierDescription.value,
    });
    //this.dossierForm.reset();
    //this.advancePayments.reset();
  }

  removeFee($event: MouseEvent, f: Fee) {
    $event.stopPropagation();
    this.searchExpense = '';
    this.feeRemoved.emit(f);
  }

  getStyleForTag(f: Fee) {
    const label = this.labels.find((l) => l.name === f.tag);
    if (!label) {
      console.log('no label found! weird...');
      return { color: '#FFFFFF' };
    }
    return { color: label.colorHex };
  }

  removeInvoice($event: MouseEvent, i: Invoice) {
    $event.stopPropagation();
    this.invoiceRemoved.emit(i);
  }
  removeDocument($event: MouseEvent, a: AdministrativeDocument) {
    $event.stopPropagation();
    this.documentRemoved.emit(a);
  }

  private createAdvancePayments(payments: TvaAdvancePayment[]): UntypedFormGroup[] {
    return payments?.map(this.convertAdvancePaymentToForm);
  }

  addAdvancePayment() {
    this.advancePayments.push(this.convertAdvancePaymentToForm({}));
  }

  convertAdvancePaymentToForm = (tva: TvaAdvancePayment): UntypedFormGroup => {
    return new UntypedFormGroup({
      datePaid: new UntypedFormControl(
        {
          value: DateUtils.formatInputDate(DateUtils.toDateOrNow(tva.datePaid)),
          disabled: this.dossier.closed && !this.recallForModification,
        },
        [Validators.required],
      ),
      advance: new UntypedFormControl(
        {
          value: tva.advance,
          disabled: this.dossier.closed && !this.recallForModification,
        },
        [Validators.required, Validators.min(1)],
      ),
    });
  };

  removeAdvancePayment(index: number) {
    this.advancePayments.removeAt(index);
  }

  downloadSummary($event: any) {
    $event.preventDefault();
    this.onDownloadSummary.emit(this.dossier);
  }

  openFeeDetail(f: Fee) {
    const modalRef = this.modalService.open(FeeDetailComponent, { size: 'xl' });
    modalRef.componentInstance.fee = f;
  }

  openInvoiceDetail(i: Invoice) {
    const modalRef = this.modalService.open(InvoiceDetailComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.invoice = i;
    modalRef.componentInstance.templates = [];
    modalRef.componentInstance.clients = this.clients;
  }

  async openDocumentDetail(d: AdministrativeDocument) {
    d.attachment = await firstValueFrom(this.fileService.findById(d.attachmentId));
    const modalRef = this.modalService.open(DocumentEditorComponent, { size: 'xl' });
    modalRef.componentInstance.adminDoc = d;
    modalRef.componentInstance.formDisabled = true;
  }

  filterExpense() {
    if (this.searchExpense?.length > 2) {
      this.filteredExpenses = this.expenses.filter((e) => {
        return (
          e.subject.toLocaleLowerCase().includes(this.searchExpense.toLocaleLowerCase()) ||
          e.tag.toString().toLocaleLowerCase().includes(this.searchExpense)
        );
      });
    } else if (!this.searchExpense?.length) {
      this.filteredExpenses = this.expenses;
    }
  }
}
