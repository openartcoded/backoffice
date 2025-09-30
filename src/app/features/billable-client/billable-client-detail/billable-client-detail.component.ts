import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BillableClient, ContractStatus, getAllDays } from '@core/models/billable-client';
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

@Component({
    selector: 'app-billable-client-detail',
    templateUrl: './billable-client-detail.component.html',
    styleUrls: ['./billable-client-detail.component.scss'],
    standalone: false
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
    ) { }

    ngOnInit(): void {
        this.clientForm = this.fb.group({
            vatNumber: new UntypedFormControl({ value: this.client?.vatNumber, disabled: !this.hasRoleAdmin }, [
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
                Validators.pattern(/^[A-Z]{2}$/)

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
            rate: new UntypedFormControl({ value: this.client?.rate, disabled: !this.hasRoleAdmin }, [Validators.required]),
            rateType: new UntypedFormControl({ value: this.client?.rateType, disabled: !this.hasRoleAdmin }, [
                Validators.required,
            ]),

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
        this.onSaveClient.emit({
            id: this.client?.id,
            vatNumber: this.clientForm.get('vatNumber').value,
            taxRate: this.clientForm.get('taxRate').value,
            countryCode: this.clientForm.get('countryCode').value,
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
