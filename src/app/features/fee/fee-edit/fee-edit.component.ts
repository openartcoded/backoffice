import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Fee } from '@core/models/fee';
import { FileUpload } from '@core/models/file-upload';
import { FeeService } from '@core/service/fee.service';
import { FileService } from '@core/service/file.service';
import { ToastService } from '@core/service/toast.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  NgbActiveModal,
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ImageViewerComponent } from '@shared/image-viewer/image-viewer.component';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';
import { AutosizeModule } from 'ngx-autosize';
import { NgxFileDropModule } from 'ngx-file-drop';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-fee-edit',
  standalone: true,
  imports: [
    NgbNavModule,
    NgxFileDropModule,
    SharedModule,
    RouterModule,
    FormsModule,
    NgbDropdownModule,
    CommonModule,
    NgbTooltipModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AutosizeModule,
  ],
  templateUrl: './fee-edit.component.html',
  styleUrl: './fee-edit.component.scss',
})
export class FeeEditComponent {
  @Input() fee!: Fee;
  @Input() hasRoleAdmin = false;
  @Output() feeUpdated = new EventEmitter<Fee>();

  @Input()
  demoMode: boolean;
  selectedFile?: File;
  isPaymentProof = false;
  uploading = false;
  saving = false;

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private feeService: FeeService,
    private modalService: NgbModal,
    private toastService: ToastService,
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
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

  uploadAttachment() {
    if (!this.fee?.id || !this.selectedFile) return;
    this.uploading = true;

    this.feeService.addAttachment(this.fee.id, this.selectedFile, this.isPaymentProof).subscribe({
      next: (f) => {
        this.fee = f;
        this.toastService.showSuccess('Attachment uploaded');
        this.feeUpdated.emit(f);
        this.selectedFile = undefined;
      },
      error: () => {
        this.toastService.showDanger('Upload failed. Try with less attachments');
        this.selectedFile = undefined;
        this.uploading = false;
      },
      complete: () => (this.uploading = false),
    });
  }

  updateFee() {
    if (!this.hasRoleAdmin || !this.fee) return;
    this.saving = true;

    this.feeService.update(this.fee).subscribe({
      next: (f) => {
        this.toastService.showSuccess('Fee updated');
        this.feeUpdated.emit(f);
      },
      error: () => this.toastService.showDanger('Update failed'),
      complete: () => (this.saving = false),
    });
  }

  markPaymentProof(a: FileUpload) {
    if (!this.fee.attachmentIds.includes(a.id)) {
      this.toastService.showDanger('Attachment not part of fee');
      return;
    }
    this.fee.paymentProofUploadId = a.id;
  }
}
