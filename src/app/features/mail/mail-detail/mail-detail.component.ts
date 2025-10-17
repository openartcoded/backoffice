import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
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
  standalone: false,
})
export class MailDetailComponent implements OnInit {
  @Input()
  mail: MailJob;
  @Input()
  demoMode: boolean;
  @Output()
  update: EventEmitter<MailJob> = new EventEmitter<MailJob>();

  mailForm: UntypedFormGroup;
  uploads: FileUpload[];
  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private fileService: FileService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
  ) {}
  ngOnInit(): void {
    this.load();
  }
  openPdfViewer(evt: any, upl: FileUpload) {
    evt.preventDefault();

    const ngbModalRef = this.modalService.open(PdfViewerComponent, {
      size: 'xl',
      scrollable: true,
    });
    ngbModalRef.componentInstance.pdf = upl;
    ngbModalRef.componentInstance.demoMode = this.demoMode;
    ngbModalRef.componentInstance.title = upl?.originalFilename;
  }
  downloadAttachment(evt: any, a: FileUpload) {
    evt.preventDefault();
    this.fileService.download(a);
  }
  openImageViewer(evt: any, a: FileUpload) {
    evt.preventDefault();

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
      mailSubject: new UntypedFormControl({ value: this.mail.subject, disabled: this.mail.sent }, []),
      mailTos: new UntypedFormControl({ value: this.mail.to, disabled: this.mail.sent }, []),
      sent: new UntypedFormControl({ value: this.mail.sent, disabled: true }, []),
      mailBody: new UntypedFormControl({ value: this.mail.body, disabled: this.mail.sent }, []),
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

  send() {
    this.mail.subject = this.mailForm.get('mailSubject').value;
    this.mail.body = this.mailForm.get('mailBody').value;
    this.mail.to = this.mailForm.get('mailTos').value;
    this.update.emit(this.mail);
  }
}
