import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BillTo, Invoice, InvoiceForm, InvoiceFreemarkerTemplate, InvoiceRow } from '@core/models/invoice';
import { RateType } from '@core/models/common';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import moment from 'moment';
import { DateUtils } from '@core/utils/date-utils';
import { BillableClient } from '@core/models/billable-client';
import { FileService } from '@core/service/file.service';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';
import { firstValueFrom } from 'rxjs';
import { MailFormComponent } from '@shared/mail-form/mail-form.component';
import { MailContextType, MailRequest } from '@core/models/mail';
import { MailService } from '@core/service/mail.service';
import { ToastService } from '@core/service/toast.service';
import { User } from '@core/models/user';
import { FileUpload } from '@core/models/file-upload';
import { InvoiceService } from '@core/service/invoice.service';
import { PeppolValidationResultComponent } from '../peppol-validation-result/peppol-validation-result.component';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
  standalone: false,
})
export class InvoiceDetailComponent implements OnInit {
  validating = false;
  ublXML?: FileUpload;
  pdf?: FileUpload;
  @Input()
  invoice: Invoice;
  @Input()
  demoMode: boolean;
  @Input()
  user: User;
  get hasRoleAdmin(): boolean {
    return this.user.authorities.includes('ADMIN');
  }
  @Input()
  templates: InvoiceFreemarkerTemplate[];

  @Input()
  clients: BillableClient[];

  @Output()
  onSaveInvoice: EventEmitter<InvoiceForm> = new EventEmitter<InvoiceForm>();

  invoiceForm: UntypedFormGroup;

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fileService: FileService,
    private mailService: MailService,
    private invoiceService: InvoiceService,
    private toastService: ToastService,
    private formBuilder: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {
    this.invoiceForm = this.createFormGroup();
    if (this.invoice.invoiceUBLId) {
      this.fileService.findById(this.invoice.invoiceUBLId).subscribe((upl) => (this.ublXML = upl));
    }
    if (this.invoice.invoiceUploadId) {
      this.fileService.findById(this.invoice.invoiceUploadId).subscribe((upl) => (this.pdf = upl));
    }
  }

  download(): void {
    this.fileService.findById(this.invoice.invoiceUploadId).subscribe((f) => this.fileService.download(f));
  }
  async sendMail() {
    if (!this.hasRoleAdmin) {
      return;
    }
    const upload = await firstValueFrom(this.fileService.findById(this.invoice.invoiceUploadId));
    const context: Map<string, MailContextType> = new Map();
    context.set('Invoice Ref', this.invoice.invoiceNumber);
    context.set('Invoice N°', this.invoice.newInvoiceNumber);
    context.set('Client', this.invoice.billTo?.clientName);
    context.set('Period', this.invoice.invoiceTable[0]?.period);

    const ngbModalRef = this.modalService.open(MailFormComponent, {
      size: 'lg',
    });
    ngbModalRef.componentInstance.context = context;
    ngbModalRef.componentInstance.defaultSubject = `Invoice ${
      this.invoice.newInvoiceNumber || this.invoice.invoiceNumber
    }`;
    ngbModalRef.componentInstance.to = [this.invoice.billTo?.emailAddress];

    ngbModalRef.componentInstance.attachments = [upload];

    ngbModalRef.componentInstance.sendMail.subscribe(async (mailRequest: MailRequest) => {
      ngbModalRef.close();
      await firstValueFrom(this.mailService.send(mailRequest));
      this.toastService.showSuccess('Mail will be send');
    });
  }
  async validatePeppol($event: any, invoice: Invoice) {
    $event.preventDefault();
    this.validating = true;
    const res = await firstValueFrom(this.invoiceService.validatePeppol(invoice.id));
    const ngbModalRef = this.modalService.open(PeppolValidationResultComponent, {
      size: 'lg',
      scrollable: true,
    });
    ngbModalRef.componentInstance.result = res;
    this.validating = false;
  }

  openPdfViewer() {
    this.fileService.findById(this.invoice.invoiceUploadId).subscribe((upl) => {
      const ngbModalRef = this.modalService.open(PdfViewerComponent, {
        size: 'xl',
        scrollable: true,
      });
      ngbModalRef.componentInstance.pdf = upl;
      ngbModalRef.componentInstance.title = upl?.originalFilename;
    });
  }
  createFormGroup(): UntypedFormGroup {
    return this.formBuilder.group({
      invoiceNumber: new UntypedFormControl(
        { value: this.invoice.invoiceNumber, disabled: true /* always disabled, coming from backend */ },
        [Validators.maxLength(9)],
      ),
      creditNote: new UntypedFormControl({ value: this.invoice.creditNote, disabled: true }, []),
      creditNoteInvoiceReference: new UntypedFormControl(
        { value: this.invoice.creditNoteInvoiceReference, disabled: true },
        [],
      ),
      newInvoiceNumber: new UntypedFormControl(
        { value: this.invoice.newInvoiceNumber, disabled: true /* always disabled, coming from backend */ },
        [Validators.maxLength(9)],
      ),

      freemarkerTemplateId: new UntypedFormControl(
        {
          value: this.templates.some((templ) => templ.id === this.invoice.freemarkerTemplateId)
            ? this.invoice.freemarkerTemplateId
            : null,
          disabled: !this.hasRoleAdmin || this.invoice.locked,
        },
        [Validators.required],
      ),
      selectedClient: new UntypedFormControl(
        {
          value: this.clients.find((c) => c.name === this.invoice.billTo?.clientName),
          disabled: !this.hasRoleAdmin || this.invoice.locked,
        },
        [],
      ),
      maxDaysToPay: new UntypedFormControl({ value: this.invoice.maxDaysToPay, disabled: this.invoice.locked }, [
        Validators.min(1),
      ]),
      file: new UntypedFormControl(null, []),

      dateOfInvoice: new UntypedFormControl(
        {
          value: DateUtils.formatInputDate(DateUtils.toDateOrNow(this.invoice.dateOfInvoice)),
          disabled: !this.hasRoleAdmin || this.invoice.locked,
        },
        [Validators.required],
      ),
      taxRate: new UntypedFormControl(
        { value: this.invoice.taxRate, disabled: !this.hasRoleAdmin || this.invoice.locked },
        [Validators.required],
      ),
      locked: new UntypedFormControl({ value: this.invoice.locked, disabled: true }, []),
      uploadedManually: new UntypedFormControl(
        { value: this.invoice.uploadedManually, disabled: !this.hasRoleAdmin || this.invoice.locked },
        [],
      ),
      logicalDelete: new UntypedFormControl({ value: this.invoice.logicalDelete, disabled: true }, []),
      billToVatNumber: new UntypedFormControl(
        {
          value: this.invoice?.billTo?.vatNumber,
          disabled: !this.hasRoleAdmin || this.invoice.locked,
        },
        [Validators.required],
      ),
      billToClientName: new UntypedFormControl(
        {
          value: this.invoice?.billTo?.clientName,
          disabled: !this.hasRoleAdmin || this.invoice.locked,
        },
        [Validators.required],
      ),
      billToCity: new UntypedFormControl(
        { value: this.invoice?.billTo?.city, disabled: !this.hasRoleAdmin || this.invoice.locked },
        [Validators.required],
      ),
      specialNote: new UntypedFormControl(
        { value: this.invoice?.specialNote, disabled: !this.hasRoleAdmin || this.invoice.locked },
        [],
      ),
      billToAddress: new UntypedFormControl(
        { value: this.invoice?.billTo?.address, disabled: !this.hasRoleAdmin || this.invoice.locked },
        [Validators.required],
      ),
      billToEmailAddress: new UntypedFormControl(
        {
          value: this.invoice?.billTo?.emailAddress,
          disabled: !this.hasRoleAdmin || this.invoice.locked,
        },
        [Validators.required],
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
    if (!this.hasRoleAdmin) {
      return;
    }
    this.invoiceForm.get('file').patchValue(file);
  }
  get specialNote() {
    return this.invoiceForm.get('specialNote').value;
  }

  set specialNote(note) {
    if (!this.hasRoleAdmin) {
      return;
    }
    this.invoiceForm.get('specialNote').patchValue(note);
  }

  drop(files: NgxFileDropEntry[]) {
    if (!this.hasRoleAdmin) {
      return;
    }
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
        nature: new UntypedFormControl({ value: table.nature, disabled: !this.hasRoleAdmin || this.invoice.locked }, [
          Validators.required,
        ]),
        period: new UntypedFormControl({ value: period, disabled: !this.hasRoleAdmin || this.invoice.locked }, [
          Validators.required,
        ]),
        projectName: new UntypedFormControl(
          { value: table.projectName, disabled: !this.hasRoleAdmin || this.invoice.locked },
          [Validators.required],
        ),
        rate: new UntypedFormControl({ value: table.rate, disabled: !this.hasRoleAdmin || this.invoice.locked }, [
          Validators.required,
        ]),
        rateType: new UntypedFormControl(
          { value: table.rateType, disabled: !this.hasRoleAdmin || this.invoice.locked },
          [Validators.required],
        ),
        amount: new UntypedFormControl({ value: table.amount, disabled: !this.hasRoleAdmin || this.invoice.locked }, [
          Validators.required,
          Validators.min(1),
        ]),
        amountType: new UntypedFormControl(
          { value: table.amountType, disabled: !this.hasRoleAdmin || this.invoice.locked },
          [Validators.required],
        ),
      });
    };
    let arr = this.invoice?.invoiceTable?.length
      ? this.invoice?.invoiceTable
      : [
          {
            rateType: RateType.HOURS,
            amountType: RateType.DAYS,
          },
        ];
    return arr.map(convertInvoiceRowToForm);
  }

  send() {
    if (!this.hasRoleAdmin) {
      return;
    }
    let toSave = {
      invoiceNumber: this.invoice.invoiceNumber /* this.invoiceForm.get('invoiceNumber').value */,
      freemarkerTemplateId: this.invoiceForm.get('freemarkerTemplateId').value,
      specialNote: this.invoiceForm.get('specialNote').value,
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
    return [RateType[RateType.DAYS], RateType[RateType.HOURS]];
  }
  findInvalidControls() {
    const invalid = [];
    const controls = this.invoiceForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  fillFromClient() {
    const client: BillableClient = this.invoiceForm.get('selectedClient').value;
    this.invoiceForm.get('billToVatNumber').patchValue(client?.vatNumber);
    this.invoiceForm.get('billToClientName').patchValue(client?.name);
    this.invoiceForm.get('billToCity').patchValue(client?.city);
    this.invoiceForm.get('billToAddress').patchValue(client?.address);
    this.invoiceForm.get('billToEmailAddress').patchValue(client?.emailAddress);
    this.invoiceForm.get('maxDaysToPay').patchValue(client?.maxDaysToPay);
    this.invoiceForm.get('taxRate').patchValue(client?.taxRate);
    this.invoiceTableForm.controls.forEach((c) => {
      c.get('projectName').patchValue(client?.projectName);
      c.get('rateType').patchValue(client?.rateType);
      c.get('rate').patchValue(client?.rate);
      c.get('nature').patchValue(client?.nature);
    });
  }
}
