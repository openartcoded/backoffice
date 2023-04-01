import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FileUpload } from '@core/models/file-upload';
import { MailRequest } from '@core/models/mail-request';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mail-form',
  templateUrl: './mail-form.component.html',
  styleUrls: ['./mail-form.component.scss'],
})
export class MailFormComponent {
  public mailForm: UntypedFormGroup;

  @Input()
  attachments: FileUpload[];

  @Input()
  to?: string;

  @Output()
  sendMail: EventEmitter<MailRequest> = new EventEmitter<MailRequest>();

  constructor(private fb: UntypedFormBuilder, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.mailForm = this.fb.group({
      to: [this.to, [Validators.required, Validators.email]],
      subject: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      body: [null, [Validators.required, Validators.minLength(1)]],
      bcc: [false, [Validators.required]],
    });
  }

  get mailTo(): string {
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
  removeAttachment($event: MouseEvent, a: FileUpload) {
    $event.stopPropagation();
    this.attachments = this.attachments.filter((attachment) => attachment.id !== a.id);
  }
  send() {
    this.sendMail.emit({
      to: this.mailTo,
      subject: this.subject,
      body: this.body,
      bcc: this.bcc,
      uploadIds: (this.attachments || []).map((a) => a.id),
    } as MailRequest);
    this.mailForm.reset();
  }
}