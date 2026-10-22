import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BillableClient, ClientRate, ContractStatus, getAllDays } from '@core/models/billable-client';
import { RateType } from '@core/models/common';
import { FileUpload } from '@core/models/file-upload';
import { MailContextType, MailRequest } from '@core/models/mail';
import { User } from '@core/models/user';
import { FileService } from '@core/service/file.service';
import { MailService } from '@core/service/mail.service';
import { ToastService } from '@core/service/toast.service';
import { DateUtils } from '@core/utils/date-utils';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewerComponent } from '@shared/image-viewer/image-viewer.component';
import { MailFormComponent } from '@shared/mail-form/mail-form.component';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';
import { firstValueFrom } from 'rxjs';

// the backend sends/expects the name of the enum ('DAYS'), which is what the select options use
const DEFAULT_RATE_TYPE = RateType[RateType.DAYS] as unknown as RateType;

@Component({
  selector: 'app-billable-client-detail',
  templateUrl: './billable-client-detail.component.html',
  styleUrls: ['./billable-client-detail.component.scss'],
  standalone: false,
})
export class BillableClientDetailComponent implements OnInit {
  @Input()
  client: BillableClient;

  @Input()
  demoMode: boolean;

  @Input()
  user: User;
  get hasRoleAdmin(): boolean {
    return this.user.authorities.includes('ADMIN');
  }
  file: File;

  @Output()
  onSaveClient: EventEmitter<BillableClient> = new EventEmitter<BillableClient>();

  @Output()
  onUpload: EventEmitter<{ file: File; id: string }> = new EventEmitter<{ file: File; id: string }>();

  @Output()
  onDeleteUpload: EventEmitter<{ id: string; uploadId: string }> = new EventEmitter<{ id: string; uploadId: string }>();

  clientForm: UntypedFormGroup;

  workingDays = getAllDays();

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private fileService: FileService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private mailService: MailService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      vatNumber: new UntypedFormControl({ value: this.client?.vatNumber, disabled: !this.hasRoleAdmin }, [
        Validators.required,
      ]),
      student: new UntypedFormControl({ value: this.client?.student, disabled: !this.hasRoleAdmin }, [
        Validators.required,
      ]),
      maxDaysToPay: new UntypedFormControl({ value: this.client?.maxDaysToPay, disabled: !this.hasRoleAdmin }, [
        Validators.required,
        Validators.min(0),
      ]),
      taxRate: new UntypedFormControl({ value: this.client?.taxRate, disabled: !this.hasRoleAdmin }, [
        Validators.required,
        Validators.min(0),
      ]),
      countryCode: new UntypedFormControl({ value: this.client?.countryCode, disabled: !this.hasRoleAdmin }, [
        Validators.required,
        Validators.pattern(/^[A-Z]{2}$/),
      ]),
      nature: new UntypedFormControl({ value: this.client?.nature, disabled: !this.hasRoleAdmin }, [
        Validators.required,
      ]),
      clientName: new UntypedFormControl({ value: this.client?.name, disabled: !this.hasRoleAdmin }, [
        Validators.required,
      ]),
      city: new UntypedFormControl({ value: this.client?.city, disabled: !this.hasRoleAdmin }, [Validators.required]),
      address: new UntypedFormControl({ value: this.client?.address, disabled: !this.hasRoleAdmin }, [
        Validators.required,
      ]),
      emailAddress: new UntypedFormControl(
        {
          value: this.client?.emailAddress,
          disabled: !this.hasRoleAdmin,
        },
        [],
      ),
      projectName: new UntypedFormControl({ value: this.client?.projectName, disabled: !this.hasRoleAdmin }, [
        Validators.required,
      ]),
      defaultWorkingDays: new UntypedFormControl(
        { value: this.client?.defaultWorkingDays, disabled: !this.hasRoleAdmin },
        [Validators.required],
      ),
      rates: new UntypedFormArray(this.initialRates().map((r) => this.createRateForm(r))),

      startDate: new UntypedFormControl(
        {
          value: DateUtils.formatInputDate(DateUtils.toDateOrNow(this.client?.startDate)),
          disabled: !this.hasRoleAdmin,
        },
        [Validators.required],
      ),
      endDate: new UntypedFormControl(
        {
          value: DateUtils.formatInputDate(DateUtils.toOptionalDate(this.client?.endDate)),
          disabled: !this.hasRoleAdmin,
        },
        [],
      ),
      contractStatus: new UntypedFormControl({ value: this.client?.contractStatus, disabled: !this.hasRoleAdmin }, [
        Validators.required,
      ]),
      phoneNumber: new UntypedFormControl({ value: this.client?.phoneNumber, disabled: !this.hasRoleAdmin }, []),
    });
  }

  /**
   * The rates of the client. Clients not migrated yet only have the legacy rate/rateType,
   * it then becomes the first (default) rate.
   */
  private initialRates(): ClientRate[] {
    if (this.client?.rates?.length) {
      return this.client.rates;
    }
    return [{ rate: this.client?.rate, rateType: this.client?.rateType ?? DEFAULT_RATE_TYPE }];
  }

  private createRateForm(r: ClientRate): UntypedFormGroup {
    const disabled = !this.hasRoleAdmin;
    return new UntypedFormGroup({
      id: new UntypedFormControl({ value: r.id, disabled }),
      label: new UntypedFormControl({ value: r.label, disabled }, [Validators.maxLength(100)]),
      rate: new UntypedFormControl({ value: r.rate, disabled }, [Validators.required, Validators.min(0)]),
      rateType: new UntypedFormControl({ value: r.rateType, disabled }, [Validators.required]),
    });
  }

  get ratesForm(): UntypedFormArray {
    return this.clientForm.get('rates') as UntypedFormArray;
  }

  addRate(): void {
    if (!this.hasRoleAdmin) {
      return;
    }
    const last = this.ratesForm.length ? this.ratesForm.at(this.ratesForm.length - 1).value : undefined;
    // a new rate has no id yet (given by the backend), the rate type of the previous one is kept
    this.ratesForm.push(this.createRateForm({ rateType: last?.rateType ?? DEFAULT_RATE_TYPE }));
  }

  removeRate(index: number): void {
    if (!this.hasRoleAdmin || this.ratesForm.length <= 1) {
      return;
    }
    this.ratesForm.removeAt(index);
  }

  /** the first rate is the default one */
  makeDefaultRate(index: number): void {
    if (!this.hasRoleAdmin || index <= 0 || index >= this.ratesForm.length) {
      return;
    }
    const ctrl = this.ratesForm.at(index);
    this.ratesForm.removeAt(index);
    this.ratesForm.insert(0, ctrl);
  }

  get startDate(): string {
    return this.clientForm.get('startDate').value;
  }

  get endDate(): string {
    return this.clientForm.get('endDate').value;
  }

  getRateType() {
    return [RateType[RateType.DAYS], RateType[RateType.HOURS]];
  }

  getContractStatus() {
    return [
      ContractStatus[ContractStatus.NOT_STARTED_YET],
      ContractStatus[ContractStatus.ONGOING],
      ContractStatus[ContractStatus.DONE],
    ];
  }
  get countryCode(): File {
    return this.clientForm.get('countryCode').value;
  }
  set countryCode(c: string) {
    this.clientForm.get('countryCode').patchValue(c);
  }
  send() {
    if (!this.hasRoleAdmin) {
      return;
    }
    const rates: ClientRate[] = this.ratesForm.controls.map((c) => ({
      id: c.get('id').value || undefined,
      label: c.get('label').value?.trim() || undefined,
      rate: c.get('rate').value,
      rateType: c.get('rateType').value,
    }));
    this.onSaveClient.emit({
      id: this.client?.id,
      vatNumber: this.clientForm.get('vatNumber').value,
      student: this.clientForm.get('student').value,
      taxRate: this.clientForm.get('taxRate').value,
      countryCode: this.clientForm.get('countryCode').value,
      nature: this.clientForm.get('nature').value,
      name: this.clientForm.get('clientName').value,
      city: this.clientForm.get('city').value,
      address: this.clientForm.get('address').value,
      emailAddress: this.clientForm.get('emailAddress').value,
      phoneNumber: this.clientForm.get('phoneNumber').value,
      projectName: this.clientForm.get('projectName').value,
      rates,
      // legacy fields mirror the default (first) rate
      rate: rates[0]?.rate,
      rateType: rates[0]?.rateType,
      contractStatus: this.clientForm.get('contractStatus').value,
      maxDaysToPay: this.clientForm.get('maxDaysToPay').value,
      defaultWorkingDays: this.clientForm.get('defaultWorkingDays').value,
      startDate: DateUtils.getDateFromInput(this.clientForm.get('startDate').value),
      endDate: DateUtils.getDateFromInput(this.clientForm.get('endDate').value),
    });
  }

  async sendMail(attachment: FileUpload) {
    if (!this.hasRoleAdmin) {
      return;
    }
    const ctx: Map<string, MailContextType> = new Map();
    ctx.set('Client', this.client.name);
    ctx.set('Project', this.client.projectName);
    const ngbModalRef = this.modalService.open(MailFormComponent, {
      size: 'lg',
    });
    ngbModalRef.componentInstance.attachments = [attachment];
    ngbModalRef.componentInstance.context = ctx;
    ngbModalRef.componentInstance.to = [this.client.emailAddress];
    ngbModalRef.componentInstance.sendMail.subscribe(async (mailRequest: MailRequest) => {
      ngbModalRef.close();
      await firstValueFrom(this.mailService.send(mailRequest));
      this.toastService.showSuccess('Mail will be send');
    });
  }

  upload() {
    if (!this.hasRoleAdmin) {
      return;
    }
    this.onUpload.emit({ file: this.file, id: this.client.id });
    this.file = null;
  }

  loadFile($event) {
    this.file = $event.target.files[0];
  }

  openPdfViewer(a: FileUpload) {
    let ngbModalRef = this.modalService.open(PdfViewerComponent, {
      size: 'xl',
      scrollable: true,
    });
    ngbModalRef.componentInstance.pdf = a;
    ngbModalRef.componentInstance.demoMode = this.demoMode;
    ngbModalRef.componentInstance.title = a?.originalFilename;
  }

  openImageViewer(a: FileUpload) {
    let ngbModalRef = this.modalService.open(ImageViewerComponent, {
      size: 'xl',
      scrollable: true,
    });
    ngbModalRef.componentInstance.image = a;
    ngbModalRef.componentInstance.title = a?.originalFilename;
  }

  download(evt, a: FileUpload) {
    evt.stopPropagation();
    this.fileService.download(a);
  }
  removeDocument($event: MouseEvent, a: FileUpload) {
    $event.stopPropagation();
    if (!this.hasRoleAdmin) {
      return;
    }
    this.onDeleteUpload.emit({ id: this.client.id, uploadId: a.id });
  }

  isPdf(upl: FileUpload) {
    return FileService.isPdf(upl?.contentType);
  }

  isImage(upl: FileUpload) {
    return FileService.isImage(upl?.contentType);
  }
}
