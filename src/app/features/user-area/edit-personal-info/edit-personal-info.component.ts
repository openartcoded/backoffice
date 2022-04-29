import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonalInfo } from '@core/models/personal.info';
import { FileService } from '@core/service/file.service';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-personal-info',
  templateUrl: './edit-personal-info.component.html',
  styleUrls: ['./edit-personal-info.component.scss'],
})
export class EditPersonalInfoComponent implements OnInit {
  @Input()
  currentPersonalInfo: PersonalInfo;

  @Output()
  onSavePersonalInfo: EventEmitter<FormData> = new EventEmitter<FormData>();

  form: FormGroup;
  logoUrl: any;
  signatureUrl: any;

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private fileService: FileService,
    private domSanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {}

  drop($event: NgxFileDropEntry[], onListFile = (file) => {}, onReadFile = (event) => {}) {
    for (const droppedFile of $event) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        onListFile(file);
        let reader = new FileReader();
        reader.onload = onReadFile;
        reader.onerror = (event: any) => {
          console.log('File could not be read: ' + event.target.error.code);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  dropLogo($event: NgxFileDropEntry[]) {
    this.drop(
      $event,
      (file) => (this.logoUpload = file),
      (event) => (this.logoUrl = event.target.result)
    );
  }

  dropSignature($event: NgxFileDropEntry[]) {
    this.drop(
      $event,
      (file) => (this.signatureUpload = file),
      (event) => (this.signatureUrl = event.target.result)
    );
  }

  get logoUpload(): File {
    return this.form.get('logoUpload').value;
  }

  set logoUpload(file: File) {
    this.form.get('logoUpload').patchValue(file);
  }

  get signatureUpload(): File {
    return this.form.get('signatureUpload').value;
  }

  set signatureUpload(file: File) {
    this.form.get('signatureUpload').patchValue(file);
  }

  async ngOnInit() {
    if (this?.currentPersonalInfo?.logoUploadId) {
      const logo = await firstValueFrom(
        this.fileService.toDownloadLink(this.fileService.getDownloadUrl(this.currentPersonalInfo.logoUploadId))
      );
      this.logoUrl = this.domSanitizer.bypassSecurityTrustUrl(logo);
    }
    if (this?.currentPersonalInfo?.signatureUploadId) {
      const signature = await firstValueFrom(
        this.fileService.toDownloadLink(this.fileService.getDownloadUrl(this.currentPersonalInfo.signatureUploadId))
      );
      this.signatureUrl = this.domSanitizer.bypassSecurityTrustUrl(signature);
    }
    this.form = this.fb.group({
      vatNumber: new FormControl({ value: this.currentPersonalInfo?.vatNumber, disabled: false }, [
        Validators.required,
      ]),
      financeCharge: new FormControl({ value: this.currentPersonalInfo?.financeCharge, disabled: false }, [
        Validators.required,
        Validators.min(0),
      ]),
      ceoFullName: new FormControl({ value: this.currentPersonalInfo?.ceoFullName, disabled: false }, [
        Validators.required,
      ]),
      note: new FormControl({ value: this.currentPersonalInfo?.note, disabled: false }, [Validators.required]),
      organizationAddress: new FormControl(
        {
          value: this.currentPersonalInfo?.organizationAddress,
          disabled: false,
        },
        [Validators.required]
      ),
      organizationBankAccount: new FormControl(
        {
          value: this.currentPersonalInfo?.organizationBankAccount,
          disabled: false,
        },
        [Validators.required]
      ),
      organizationBankBIC: new FormControl(
        {
          value: this.currentPersonalInfo?.organizationBankBIC,
          disabled: false,
        },
        [Validators.required]
      ),
      organizationCity: new FormControl({ value: this.currentPersonalInfo?.organizationCity, disabled: false }, [
        Validators.required,
      ]),
      organizationEmailAddress: new FormControl(
        {
          value: this.currentPersonalInfo?.organizationEmailAddress,
          disabled: false,
        },
        [Validators.required]
      ),
      organizationPostCode: new FormControl(
        {
          value: this.currentPersonalInfo?.organizationPostCode,
          disabled: false,
        },
        [Validators.required]
      ),
      organizationName: new FormControl({ value: this.currentPersonalInfo?.organizationName, disabled: false }, [
        Validators.required,
      ]),
      organizationPhoneNumber: new FormControl(
        {
          value: this.currentPersonalInfo?.organizationPhoneNumber,
          disabled: false,
        },
        [Validators.required]
      ),
      logoUpload: new FormControl(null, []),
      signatureUpload: new FormControl(null, []),
    });
  }

  send() {
    const formData = new FormData();
    formData.append('logo', this.logoUpload);
    formData.append('signature', this.signatureUpload);
    formData.append('vatNumber', this.form.get('vatNumber').value);
    formData.append('ceoFullName', this.form.get('ceoFullName').value);
    formData.append('financeCharge', this.form.get('financeCharge').value);
    formData.append('note', this.form.get('note').value);
    formData.append('organizationAddress', this.form.get('organizationAddress').value);
    formData.append('organizationBankAccount', this.form.get('organizationBankAccount').value);
    formData.append('organizationBankBIC', this.form.get('organizationBankBIC').value);
    formData.append('organizationCity', this.form.get('organizationCity').value);
    formData.append('organizationEmailAddress', this.form.get('organizationEmailAddress').value);
    formData.append('organizationPostCode', this.form.get('organizationPostCode').value);
    formData.append('organizationName', this.form.get('organizationName').value);
    formData.append('organizationPhoneNumber', this.form.get('organizationPhoneNumber').value);
    this.onSavePersonalInfo.emit(formData);
    // this.form.reset();
  }
}
