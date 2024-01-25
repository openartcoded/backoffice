import { Component, Input, OnInit, Optional } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { formatDate } from '@angular/common';
import { MailJob } from '@core/models/mail';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FileService } from '@core/service/file.service';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';
import { FileUpload } from '@core/models/file-upload';
import { ImageViewerComponent } from '@shared/image-viewer/image-viewer.component';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-mail-detail',
  templateUrl: './mail-detail.component.html',
  styleUrl: './mail-detail.component.scss',
})
export class MailDetailComponent implements OnInit {
  @Input()
  mail: MailJob;
  mailForm: UntypedFormGroup;
  uploads: FileUpload[];
  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private fileService: FileService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
  ) { }
  ngOnInit(): void {
    this.load();
  }
  openPdfViewer(upl: FileUpload) {
    const ngbModalRef = this.modalService.open(PdfViewerComponent, {
      size: 'xl',
      scrollable: true,
    });
    ngbModalRef.componentInstance.pdf = upl;
    ngbModalRef.componentInstance.title = upl?.originalFilename;
  }
  downloadAttachment(evt: any, a: FileUpload) {
    evt.stopPropagation();
    this.fileService.download(a);
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

  isImage(upl: FileUpload) {
    return FileService.isImage(upl?.contentType);
  }
  async load() {
    this.uploads = await firstValueFrom(this.fileService.findByIds(this.mail.uploadIds));
    this.mailForm = this.fb.group({
      mailId: new UntypedFormControl({ value: this.mail.id, disabled: true }, []),
      mailSubject: new UntypedFormControl({ value: this.mail.subject, disabled: true }, []),
      mailTos: new UntypedFormControl({ value: this.mail.to, disabled: true }, []),
      sent: new UntypedFormControl({ value: this.mail.sent, disabled: true }, []),
      mailBody: new UntypedFormControl({ value: this.mail.body, disabled: true }, []),
      creationDate: new UntypedFormControl(
        {
          value: this.mail.createdDate ? formatDate(this.mail.createdDate, 'dd/MM/yyyy HH:mm', 'de') : null,
          disabled: true,
        },
        [],
      ),
      sendingDate: new UntypedFormControl(
        {
          value: this.mail.sendingDate ? formatDate(this.mail.sendingDate, 'dd/MM/yyyy HH:mm', 'de') : null,
          disabled: true,
        },
        [],
      ),
      updatedDate: new UntypedFormControl(
        {
          value: this.mail.updatedDate ? formatDate(this.mail.updatedDate, 'dd/MM/yyyy HH:mm', 'de') : null,
          disabled: true,
        },
        [],
      ),
    });
  }
}
