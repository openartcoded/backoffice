import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormContact } from '@core/models/form-contact';
import { GdprService } from '@core/service/gdpr.service';

@Component({
  selector: 'app-form-contact',
  templateUrl: './form-contact.component.html',
  styleUrls: ['./form-contact.component.scss'],
})
export class FormContactComponent implements OnInit {
  contactForm: FormGroup;
  @Output()
  sendFormContact: EventEmitter<FormContact> = new EventEmitter<FormContact>();

  constructor(private fb: FormBuilder, private gdprService: GdprService) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      fullName: new FormControl('', [Validators.required]),
      emailAddress: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [Validators.required]),
      bestTimeToCall: new FormControl('13:00', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      bodyMessage: new FormControl('', [Validators.required]),
    });
  }

  submit() {
    let formContact: FormContact = {
      subject: this.contactForm.get('subject').value,
      fullName: this.contactForm.get('fullName').value,
      email: this.contactForm.get('emailAddress').value,
      phoneNumber: this.contactForm.get('phoneNumber').value,
      bestTimeToCall: this.contactForm.get('bestTimeToCall').value,
      body: this.contactForm.get('bodyMessage').value,
    };
    this.sendFormContact.emit(formContact);
    this.contactForm.reset();
  }

  gdprConsent() {
    return this.gdprService.gdprConsent();
  }
}
