import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Fee, FeeTag, FeeTagColorUtils, FeeUpdatePriceRequest } from '@core/models/fee';
import { FileService } from '@core/service/file.service';
import { FileUpload } from '@core/models/file-upload';
import { FeeService } from '@core/service/fee.service';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';
import { ImageViewerComponent } from '@shared/image-viewer/image-viewer.component';

@Component({
  selector: 'app-fee-detail',
  templateUrl: './fee-detail.component.html',
  styleUrls: ['./fee-detail.component.scss'],
})
export class FeeDetailComponent implements OnInit {
  @Input()
  fee: Fee;
  @Output()
  feeUpdated: EventEmitter<Fee> = new EventEmitter<Fee>();
  tags = FeeTagColorUtils.tags();

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private feeService: FeeService,
    private modalService: NgbModal,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.loadAttachment();
  }

  loadAttachment() {
    this.fee.attachments = [];
    this.fee.attachmentIds
      .map((a) => this.fileService.findById(a))
      .forEach((obs) => obs.subscribe((f) => this.fee.attachments.push(f)));
  }

  downloadAttachment(evt, a: FileUpload) {
    evt.stopPropagation();
    this.fileService.download(a);
  }

  getClassForTag(f: Fee) {
    return FeeTagColorUtils.getClassForTag(f);
  }

  removeAttachment($event: MouseEvent, a: FileUpload) {
    $event.stopPropagation();
    this.feeService.removeAttachment(this.fee.id, a.id).subscribe((f) => {
      this.feeUpdated.emit(f);
      this.fee = f;
      this.loadAttachment();
    });
  }

  openPdfViewer(a: FileUpload) {
    let ngbModalRef = this.modalService.open(PdfViewerComponent, {
      size: 'xl',
      scrollable: true,
    });
    ngbModalRef.componentInstance.pdf = a;
    ngbModalRef.componentInstance.title = a.metadata?.originalFilename;
  }

  openImageViewer(a: FileUpload) {
    let ngbModalRef = this.modalService.open(ImageViewerComponent, {
      size: 'xl',
      scrollable: true,
    });
    ngbModalRef.componentInstance.image = a;
    ngbModalRef.componentInstance.title = a.metadata?.originalFilename;
  }
  isPdf(upl: FileUpload) {
    return FileService.isPdf(upl.metadata.contentType);
  }

  isImage(upl: FileUpload) {
    return FileService.isImage(upl.metadata.contentType);
  }

  updatePrice(request: FeeUpdatePriceRequest) {
    this.feeService.updatePrice(request.id, request.priceHVAT, request.vat).subscribe((f) => {
      this.fee = f;
      this.loadAttachment();
      this.feeUpdated.emit(this.fee);
    });
  }

  updateTag(fee: Fee, $event: FeeTag) {
    this.feeService.updateTag([fee.id], $event).subscribe((data) => {
      if (data?.length !== 1) {
        console.error('response not equals to 1!!');
      }
      this.fee = data[0];
      this.loadAttachment();
      this.feeUpdated.emit(this.fee);
    });
  }
}
