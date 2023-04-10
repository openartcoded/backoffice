import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BillableClient, ContractStatus, DefaultWorkingDay, getAllDays } from '@core/models/billable-client';
import { RateType } from '@core/models/common';
import { FileUpload } from '@core/models/file-upload';
import { FileService } from '@core/service/file.service';
import { DateUtils } from '@core/utils/date-utils';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewerComponent } from '@shared/image-viewer/image-viewer.component';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-billable-client-detail',
  templateUrl: './billable-client-detail.component.html',
  styleUrls: ['./billable-client-detail.component.scss'],
})
export class BillableClientDetailComponent implements OnInit {
  @Input()
  client: BillableClient;

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
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      vatNumber: new UntypedFormControl({ value: this.client?.vatNumber, disabled: false }, [Validators.required]),
      maxDaysToPay: new UntypedFormControl({ value: this.client?.maxDaysToPay, disabled: false }, [
        Validators.required,
        Validators.min(0),
      ]),
      taxRate: new UntypedFormControl({ value: this.client?.taxRate, disabled: false }, [
        Validators.required,
        Validators.min(0),
      ]),
      nature: new UntypedFormControl({ value: this.client?.nature, disabled: false }, [Validators.required]),
      clientName: new UntypedFormControl({ value: this.client?.name, disabled: false }, [Validators.required]),
      city: new UntypedFormControl({ value: this.client?.city, disabled: false }, [Validators.required]),
      address: new UntypedFormControl({ value: this.client?.address, disabled: false }, [Validators.required]),
      emailAddress: new UntypedFormControl(
        {
          value: this.client?.emailAddress,
          disabled: false,
        },
        []
      ),
      projectName: new UntypedFormControl({ value: this.client?.projectName, disabled: false }, [Validators.required]),
      defaultWorkingDays: new UntypedFormControl({ value: this.client?.defaultWorkingDays, disabled: false }, [
        Validators.required,
      ]),
      rate: new UntypedFormControl({ value: this.client?.rate, disabled: false }, [Validators.required]),
      rateType: new UntypedFormControl({ value: this.client?.rateType, disabled: false }, [Validators.required]),

      startDate: new UntypedFormControl(DateUtils.formatInputDate(DateUtils.toDateOrNow(this.client?.startDate)), [
        Validators.required,
      ]),
      endDate: new UntypedFormControl(DateUtils.formatInputDate(DateUtils.toOptionalDate(this.client?.endDate)), []),
      contractStatus: new UntypedFormControl({ value: this.client?.contractStatus, disabled: false }, [
        Validators.required,
      ]),
      phoneNumber: new UntypedFormControl({ value: this.client?.phoneNumber, disabled: false }, []),
    });
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

  send() {
    this.onSaveClient.emit({
      id: this.client?.id,
      vatNumber: this.clientForm.get('vatNumber').value,
      taxRate: this.clientForm.get('taxRate').value,
      nature: this.clientForm.get('nature').value,
      name: this.clientForm.get('clientName').value,
      city: this.clientForm.get('city').value,
      address: this.clientForm.get('address').value,
      emailAddress: this.clientForm.get('emailAddress').value,
      phoneNumber: this.clientForm.get('phoneNumber').value,
      projectName: this.clientForm.get('projectName').value,
      rate: this.clientForm.get('rate').value,
      rateType: this.clientForm.get('rateType').value,
      contractStatus: this.clientForm.get('contractStatus').value,
      maxDaysToPay: this.clientForm.get('maxDaysToPay').value,
      defaultWorkingDays: this.clientForm.get('defaultWorkingDays').value,
      startDate: DateUtils.getDateFromInput(this.clientForm.get('startDate').value),
      endDate: DateUtils.getDateFromInput(this.clientForm.get('endDate').value),
    });
  }

  upload() {
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
    this.onDeleteUpload.emit({ id: this.client.id, uploadId: a.id });
  }

  isPdf(upl: FileUpload) {
    return FileService.isPdf(upl?.contentType);
  }

  isImage(upl: FileUpload) {
    return FileService.isImage(upl?.contentType);
  }
}
