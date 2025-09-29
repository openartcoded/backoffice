import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Fee, FeeUpdatePriceRequest, Label } from '@core/models/fee';
import { FileService } from '@core/service/file.service';
import { FileUpload } from '@core/models/file-upload';
import { FeeService } from '@core/service/fee.service';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';
import { ImageViewerComponent } from '@shared/image-viewer/image-viewer.component';
import { LabelService } from '@core/service/label.service';
import { ToastService } from '@core/service/toast.service';
import { firstValueFrom } from 'rxjs';
import { User } from '@core/models/user';

@Component({
    selector: 'app-fee-detail',
    templateUrl: './fee-detail.component.html',
    styleUrls: ['./fee-detail.component.scss'],
})
export class FeeDetailComponent implements OnInit {
    @Input()
    fee: Fee;
    @Input()
    demoMode: boolean;
    @Output()
    feeUpdated: EventEmitter<Fee> = new EventEmitter<Fee>();
    @Input()
    user: User;

    get hasRoleAdmin(): boolean {
        return this.user.authorities.includes('ADMIN');
    }
    tags: Label[];
    constructor(
        @Optional() public activeModal: NgbActiveModal,
        private feeService: FeeService,
        private labelService: LabelService,
        private modalService: NgbModal,
        private toastService: ToastService,
        private fileService: FileService,
    ) { }

    ngOnInit(): void {
        this.load();
    }

    async load() {
        this.fee.attachments = [];
        const attachments = [];
        const labels = await firstValueFrom(this.labelService.findAll());
        for (const attachmentId of this.fee.attachmentIds) {
            const attachment = await firstValueFrom(this.fileService.findById(attachmentId));
            attachments.push(attachment);
        }
        this.fee.attachments = attachments;
        this.fee.tagId = labels.find((l) => l.name === this.fee.tag)?.id;
        this.tags = labels;
    }

    downloadAttachment(evt: any, a: FileUpload) {
        evt.stopPropagation();
        this.fileService.download(a);
    }

    getStyleForTag(f: Fee) {
        const label = this.tags.find((l) => l.name === f.tag);
        if (!label) {
            console.log('no label found! weird...');
            return { color: '#FFFFFF' };
        }
        return { color: label.colorHex };
    }

    removeAttachment($event: MouseEvent, a: FileUpload) {
        $event.stopPropagation();
        if (!this.hasRoleAdmin) {
            return;
        }
        this.feeService.removeAttachment(this.fee.id, a.id).subscribe((f) => {
            this.feeUpdated.emit(f);
            this.fee = f;
            this.load();
            this.toastService.showSuccess(`Attachment ${a.id} removed`);
        });
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
    isPdf(upl: FileUpload) {
        return FileService.isPdf(upl?.contentType);
    }
    isXML(upl: FileUpload) {
        return FileService.isXML(upl?.contentType);
    }
    isImage(upl: FileUpload) {
        return FileService.isImage(upl?.contentType);
    }

    updatePrice(request: FeeUpdatePriceRequest) {
        if (!this.hasRoleAdmin) {
            return;
        }
        this.feeService.updatePrice(request.id, request.priceHVAT, request.vat).subscribe((f) => {
            this.fee = f;
            this.load();
            this.feeUpdated.emit(this.fee);
            this.toastService.showSuccess(`Price updated`);
        });
    }

    updateTag(fee: Fee, $event: Label) {
        if (!this.hasRoleAdmin) {
            return;
        }
        this.feeService.updateTag([fee.id], $event).subscribe((data) => {
            if (data?.length !== 1) {
                console.error('response not equals to 1!!');
            }
            this.fee = data[0];

            this.load();
            this.feeUpdated.emit(this.fee);
            this.toastService.showSuccess(`Tag updated`);
        });
    }
}
