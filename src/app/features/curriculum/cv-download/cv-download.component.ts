import { Component, EventEmitter, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GdprService } from '@core/service/gdpr.service';
import { DownloadCvRequest } from '@core/models/curriculum';

@Component({
  selector: 'app-cv-download',
  templateUrl: './cv-download.component.html',
  styleUrls: ['./cv-download.component.scss'],
})
export class CvDownloadComponent implements OnInit {
  public editorForm: FormGroup;
  @Output()
  requestForCv: EventEmitter<DownloadCvRequest> = new EventEmitter<DownloadCvRequest>();

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private gdprService: GdprService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.editorForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      htmlContent: new FormControl(null, [Validators.maxLength(1024)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(null, [Validators.maxLength(15)]),
      dailyRate: new FormControl(null, []),
      availability: new FormControl(null, []),
    });
  }

  get email(): string {
    return this.editorForm.get('email').value;
  }

  get dailyRate(): boolean {
    return this.editorForm.get('dailyRate').value;
  }

  get availability(): boolean {
    return this.editorForm.get('availability').value;
  }

  get phoneNumber(): string {
    return this.editorForm.get('phoneNumber').value;
  }

  get htmlContent(): string {
    return this.editorForm.get('htmlContent').value;
  }

  send() {
    this.requestForCv.emit({
      email: this.email,
      availability: this.availability,
      dailyRate: this.dailyRate,
      phoneNumber: this.phoneNumber,
      htmlContent: this.htmlContent,
    } as DownloadCvRequest);
    this.editorForm.reset();
  }

  gdprConsent() {
    return this.gdprService.gdprConsent();
  }
}
