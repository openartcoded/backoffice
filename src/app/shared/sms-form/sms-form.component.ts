import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Sms } from '@core/models/sms';
import { PhoneValidator } from '@core/validators/phone.validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sms-form',
  templateUrl: './sms-form.component.html',
  styleUrls: ['./sms-form.component.scss']
})
export class SmsFormComponent implements OnInit {
  public smsForm: UntypedFormGroup;

  @Input()
  phoneNumber?: string;

  @Output()
  sendSms: EventEmitter<Sms> = new EventEmitter<Sms>();
  constructor(private fb: UntypedFormBuilder, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.smsForm = this.fb.group(
      {
        phoneNumber: [this.phoneNumber || '', [Validators.required]],
        body: [null, [Validators.required, Validators.minLength(1)]],
      },
      {
        validators: PhoneValidator('phoneNumber'),
      }
    );
  }
  send() {
    this.sendSms.emit({
      phoneNumber: this.smsForm.get('phoneNumber').value,
      message: this.smsForm.get('body').value,
    } as Sms);
    this.smsForm.reset();
  }

}
