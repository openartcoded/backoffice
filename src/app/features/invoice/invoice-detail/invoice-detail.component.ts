import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  BillTo,
  CurrentBillTo,
  Invoice,
  InvoiceForm,
  InvoiceFreemarkerTemplate,
  InvoiceRow,
  InvoicingType,
} from '@core/models/invoice';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
})
export class InvoiceDetailComponent implements OnInit {
  @Input()
  invoice: Invoice;

  @Input()
  templates$: Observable<InvoiceFreemarkerTemplate[]>;

  @Input()
  currentBillTo: CurrentBillTo;

  @Output()
  onSaveInvoice: EventEmitter<InvoiceForm> = new EventEmitter<InvoiceForm>();

  invoiceForm: UntypedFormGroup;

  constructor(@Optional() public activeModal: NgbActiveModal, private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.invoiceForm = this.createFormGroup();
  }

  createFormGroup(): UntypedFormGroup {
    return this.formBuilder.group({
      invoiceNumber: new UntypedFormControl({ value: this.invoice.invoiceNumber, disabled: this.invoice.locked }, [
        Validators.maxLength(9),
      ]),
      freemarkerTemplateId: new UntypedFormControl(
        {
          value: this.invoice.freemarkerTemplateId,
          disabled: this.invoice.locked,
        },
        []
      ),
      maxDaysToPay: new UntypedFormControl({ value: this.invoice.maxDaysToPay, disabled: this.invoice.locked }, [
        Validators.min(1),
      ]),
      file: new UntypedFormControl(null, []),
      dateOfInvoice: new UntypedFormControl(
        {
          value: DateUtils.formatInputDate(DateUtils.toDateOrNow(this.invoice.dateOfInvoice)),
          disabled: this.invoice.locked,
        },
        [Validators.required]
      ),
      taxRate: new UntypedFormControl({ value: this.invoice.taxRate, disabled: this.invoice.locked }, [Validators.required]),
      locked: new UntypedFormControl({ value: this.invoice.locked, disabled: true }, []),
      uploadedManually: new UntypedFormControl({ value: this.invoice.uploadedManually, disabled: this.invoice.locked }, []),
      logicalDelete: new UntypedFormControl({ value: this.invoice.logicalDelete, disabled: true }, []),
      billToVatNumber: new UntypedFormControl(
        {
          value: this.invoice?.billTo?.vatNumber,
          disabled: this.invoice.locked,
        },
        [Validators.required]
      ),
      billToClientName: new UntypedFormControl(
        {
          value: this.invoice?.billTo?.clientName,
          disabled: this.invoice.locked,
        },
        [Validators.required]
      ),
      billToCity: new UntypedFormControl({ value: this.invoice?.billTo?.city, disabled: this.invoice.locked }, [
        Validators.required,
      ]),
      billToAddress: new UntypedFormControl({ value: this.invoice?.billTo?.address, disabled: this.invoice.locked }, [
        Validators.required,
      ]),
      billToEmailAddress: new UntypedFormControl(
        {
          value: this.invoice?.billTo?.emailAddress,
          disabled: this.invoice.locked,
        },
        []
      ),
      invoiceTableForm: new UntypedFormArray(this.createInvoiceTable()),
    });
  }

  get invoiceTableForm(): UntypedFormArray {
    return this.invoiceForm.get('invoiceTableForm') as UntypedFormArray;
  }

  get uploadedManually(): boolean {
    return this.invoiceForm.get('uploadedManually').value;
  }

  get logicalDelete(): boolean {
    return this.invoiceForm.get('logicalDelete').value;
  }

  get locked(): boolean {
    return this.invoiceForm.get('locked').value;
  }

  get file() {
    return this.invoiceForm.get('file').value;
  }

  set file(file) {
    this.invoiceForm.get('file').patchValue(file);
  }

  drop(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.file = file;
      });
    }
  }

  createInvoiceTable(): UntypedFormGroup[] {
    let convertInvoiceRowToForm = (table) => {
      const period = table.period
        ? moment(table.period, 'MM/yyyy').format('YYYY-MM')
        : moment(new Date()).format('YYYY-MM');

      return new UntypedFormGroup({
        nature: new UntypedFormControl({ value: table.nature, disabled: this.invoice.locked }, [Validators.required]),
        period: new UntypedFormControl({ value: period, disabled: this.invoice.locked }, [Validators.required]),
        projectName: new UntypedFormControl({ value: table.projectName, disabled: this.invoice.locked }, [
          Validators.required,
        ]),
        rate: new UntypedFormControl({ value: table.rate, disabled: this.invoice.locked }, [Validators.required]),
        rateType: new UntypedFormControl({ value: table.rateType, disabled: this.invoice.locked }, [Validators.required]),
        amount: new UntypedFormControl({ value: table.amount, disabled: this.invoice.locked }, [
          Validators.required,
          Validators.min(1),
        ]),
        amountType: new UntypedFormControl({ value: table.amountType, disabled: this.invoice.locked }, [Validators.required]),
      });
    };
    let arr = this.invoice?.invoiceTable?.length
      ? this.invoice?.invoiceTable
      : [
          {
            rateType: InvoicingType.HOURS,
            amountType: InvoicingType.DAYS,
          },
        ];
    return arr.map(convertInvoiceRowToForm);
  }

  send() {
    let toSave = {
      invoiceNumber: this.invoiceForm.get('invoiceNumber').value,
      freemarkerTemplateId: this.invoiceForm.get('freemarkerTemplateId').value,
      maxDaysToPay: this.invoiceForm.get('maxDaysToPay').value,
      dateOfInvoice: DateUtils.getDateFromInput(this.invoiceForm.get('dateOfInvoice').value),
      taxRate: this.invoiceForm.get('taxRate').value,
      uploadedManually: this.uploadedManually,
      billTo: {
        vatNumber: this.invoiceForm.get('billToVatNumber').value,
        clientName: this.invoiceForm.get('billToClientName').value,
        city: this.invoiceForm.get('billToCity').value,
        address: this.invoiceForm.get('billToAddress').value,
        emailAddress: this.invoiceForm.get('billToEmailAddress').value,
      } as BillTo,
      invoiceTable: this.invoiceTableForm.controls.map((c) => {
        return {
          projectName: c.get('projectName').value,
          nature: c.get('nature').value,
          period: moment(c.get('period').value, 'YYYY-MM').format('MM/yyyy'),
          amount: c.get('amount').value,
          rate: c.get('rate').value,
          rateType: c.get('rateType').value,
          amountType: c.get('amountType').value,
        } as InvoiceRow;
      }),
    } as Invoice;
    this.onSaveInvoice.emit({
      invoice: toSave,
      manualUploadFile: this.file,
    });
    this.invoiceForm.reset();
    this.invoiceTableForm.reset();
  }

  getInvoiceType() {
    return [InvoicingType[InvoicingType.DAYS], InvoicingType[InvoicingType.HOURS]];
  }

  fillFromCurrentBillTo(event) {
    event.preventDefault();
    this.invoiceForm.get('billToVatNumber').patchValue(this.currentBillTo?.billTo?.vatNumber);
    this.invoiceForm.get('billToClientName').patchValue(this.currentBillTo?.billTo?.clientName);
    this.invoiceForm.get('billToCity').patchValue(this.currentBillTo?.billTo?.city);
    this.invoiceForm.get('billToAddress').patchValue(this.currentBillTo?.billTo?.address);
    this.invoiceForm.get('billToEmailAddress').patchValue(this.currentBillTo?.billTo?.emailAddress);
    this.invoiceForm.get('maxDaysToPay').patchValue(this.currentBillTo?.maxDaysToPay);
    this.invoiceTableForm.controls.forEach((c) => {
      c.get('projectName').patchValue(this.currentBillTo?.projectName);
      c.get('rateType').patchValue(this.currentBillTo?.rateType);
      c.get('rate').patchValue(this.currentBillTo?.rate);
    });
  }
}
