import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FileUpload } from '@core/models/file-upload';
import { MailContextType, MailRequest } from '@core/models/mail-request';
import { DateUtils } from '@core/utils/date-utils';
import { EmailsValidator } from '@core/validators/emails.validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mail-form',
  templateUrl: './mail-form.component.html',
  styleUrls: ['./mail-form.component.scss'],
})
export class MailFormComponent implements OnInit {
  public mailForm: UntypedFormGroup;

  @Input()
  attachments: FileUpload[];

  @Input()
  context: Map<string, MailContextType> = new Map<string, MailContextType>();

  @Input()
  to?: string[];
  @Input()
  defaultSubject?: string;

  @Output()
  sendMail: EventEmitter<MailRequest> = new EventEmitter<MailRequest>();

  constructor(
    private fb: UntypedFormBuilder,
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.mailForm = this.fb.group(
      {
        to: [this.to || [], [Validators.required]],
        subject: [this.defaultSubject, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        body: [null, [Validators.required, Validators.minLength(1)]],
        sendingDate: [null, []],
        bcc: [false, [Validators.required]],
      },
      {
        validators: EmailsValidator('to'),
      },
    );
  }

  get mailTo(): string[] {
    return this.mailForm.get('to').value;
  }
  get subject(): string {
    return this.mailForm.get('subject').value;
  }
  get body(): string {
    return this.mailForm.get('body').value;
  }
  get bcc(): boolean {
    return this.mailForm.get('bcc').value;
  }

  get sendingDate(): Date {
    return this.mailForm.get('sendingDate').value;
  }

  removeAttachment($event: MouseEvent, a: FileUpload) {
    $event.stopPropagation();
    this.attachments = this.attachments.filter((attachment) => attachment.id !== a.id);
  }
  send() {
    let sendingDate = this.sendingDate ? DateUtils.getDateFromInput(this.sendingDate).toUTCString() : null;

    this.sendMail.emit({
      to: this.mailTo,
      sendingDate,
      subject: this.subject,
      body: this.body,
      bcc: this.bcc,
      uploadIds: (this.attachments || []).map((a) => a.id),
    } as MailRequest);
    this.mailForm.reset();
  }
  updateBody($event: MouseEvent, v: MailContextType) {
    $event.preventDefault();
    const body = this.body?.length ? this.body + ' ' : '';
    this.mailForm.get('body').patchValue(body + v);
  }
}
