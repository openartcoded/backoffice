import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { LabelService } from '@core/service/label.service';

@Component({
  selector: 'app-dossier-form',
  templateUrl: './dossier-form.component.html',
  styleUrls: ['./dossier-form.component.scss'],
})
export class DossierFormComponent implements OnInit {
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
  onDownloadSummary: EventEmitter<Dossier> = new EventEmitter<Dossier>();

  dossierForm: FormGroup;

  expenses: Fee[];
  filteredExpenses: Fee[];

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private feeService: FeeService,
    private modalService: NgbModal,
    private invoiceService: InvoiceService,
    private fb: FormBuilder
  ) {}

  async ngOnInit() {
    this.dossierForm = this.createFormGroup();
    await this.loadFees();
    await this.loadInvoices();
  }

  async loadFees() {
    this.expenses = [];
    this.filteredExpenses = [];
    this.feeTotalVat = 0;
    this.feeTotalExclVat = 0;
    if (this.dossier?.feeIds?.length) {
      for (let id of this.dossier.feeIds) {
        const fee = await this.feeService.findById(id).toPromise();
        this.feeTotalVat += fee.vat || 0;
        this.feeTotalExclVat += fee.priceHVAT || 0;
        this.expenses.push(fee);
        this.filteredExpenses.push(fee);
      }
    }
  }

  async loadInvoices() {
    this.dossier.invoices = [];
    this.vatTotal = 0;
    this.invoiceTotalExclVat = 0;
    if (this.dossier?.invoiceIds?.length) {
      for (let id of this.dossier.invoiceIds) {
        const invoice = await this.invoiceService.findById(id).toPromise();
        this.vatTotal += invoice.taxes;
        this.invoiceTotalExclVat += invoice.subTotal;
        this.dossier.invoices.push(invoice);
      }
    }
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      dossierId: new FormControl({ value: this.dossier.id, disabled: true }, []),
      tvaDue: new FormControl(
        {
          value: this.dossier.tvaDue,
          disabled: this.dossier.closed && !this.recallForModification,
        },
        []
      ),
      advancePayments: this.fb.array(this.createAdvancePayments(this.dossier.advancePayments)),
      dossierName: new FormControl({ value: this.dossier.name, disabled: this.dossier.closed }, [
        Validators.minLength(5),
        Validators.maxLength(20),
      ]),
      dossierDescription: new FormControl({ value: this.dossier.description, disabled: this.dossier.closed }, [
        Validators.maxLength(1024),
      ]),
      creationDate: new FormControl(
        {
          value: this.dossier.creationDate ? formatDate(this.dossier.creationDate, 'dd/MM/yyyy HH:mm', 'de') : null,
          disabled: true,
        },
        []
      ),
      updatedDate: new FormControl(
        {
          value: this.dossier.updatedDate ? formatDate(this.dossier.updatedDate, 'dd/MM/yyyy HH:mm', 'de') : null,
          disabled: true,
        },
        []
      ),
      dossierClosed: new FormControl({ value: this.dossier.closed, disabled: true }, []),

      closedDate: new FormControl(
        {
          value: this.dossier.closedDate ? formatDate(this.dossier.closedDate, 'dd/MM/yyyy HH:mm', 'de') : null,
          disabled: true,
        },
        []
      ),
      dossierRecalledForModification: new FormControl(
        {
          value: this.dossier.recalledForModification,
          disabled: true,
        },
        []
      ),

      dossierRecalledForModificationDate: new FormControl(
        {
          value: this.dossier.closedDate
            ? formatDate(this.dossier.recalledForModificationDate, 'dd/MM/yyyy HH:mm', 'de')
            : null,
          disabled: true,
        },
        []
      ),
    });
  }

  get advancePayments(): FormArray {
    return this.dossierForm.get('advancePayments') as FormArray;
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

  private createAdvancePayments(payments: TvaAdvancePayment[]): FormGroup[] {
    return payments?.map(this.convertAdvancePaymentToForm);
  }

  addAdvancePayment() {
    this.advancePayments.push(this.convertAdvancePaymentToForm({}));
  }

  convertAdvancePaymentToForm = (tva: TvaAdvancePayment): FormGroup => {
    return new FormGroup({
      datePaid: new FormControl(
        {
          value: DateUtils.formatInputDate(DateUtils.toDateOrNow(tva.datePaid)),
          disabled: this.dossier.closed && !this.recallForModification,
        },
        [Validators.required]
      ),
      advance: new FormControl(
        {
          value: tva.advance,
          disabled: this.dossier.closed && !this.recallForModification,
        },
        [Validators.required, Validators.min(1)]
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
