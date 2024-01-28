import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Accountant, PersonalInfo } from '@core/models/personal.info';
import { FileService } from '@core/service/file.service';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { User } from '@core/models/user';

@Component({
  selector: 'app-edit-personal-info',
  templateUrl: './edit-personal-info.component.html',
  styleUrls: ['./edit-personal-info.component.scss'],
})
export class EditPersonalInfoComponent implements OnInit {
  @Input()
  currentPersonalInfo: PersonalInfo;
  @Input()
  user: User;
  get hasRoleAdmin(): boolean {
    return this.user.authorities.includes('ADMIN');
  }
  @Output()
  onSavePersonalInfo: EventEmitter<FormData> = new EventEmitter<FormData>();

  form: UntypedFormGroup;
  logoUrl: any;
  signatureUrl: any;
  initialUrl: any;

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private fileService: FileService,
    private domSanitizer: DomSanitizer,
    private fb: UntypedFormBuilder,
  ) { }

  drop($event: NgxFileDropEntry[], onListFile = (_file: any) => { }, onReadFile = (_event: any) => { }) {
    if (!this.hasRoleAdmin) {
      return;
    }

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
      (event) => (this.logoUrl = event.target.result),
    );
  }

  dropSignature($event: NgxFileDropEntry[]) {
    this.drop(
      $event,
      (file) => (this.signatureUpload = file),
      (event) => (this.signatureUrl = event.target.result),
    );
  }

  dropInitial($event: NgxFileDropEntry[]) {
    this.drop(
      $event,
      (file) => (this.initialUpload = file),
      (event) => (this.initialUrl = event.target.result),
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

  get initialUpload(): File {
    return this.form.get('initialUpload').value;
  }

  set initialUpload(file: File) {
    this.form.get('initialUpload').patchValue(file);
  }
  async ngOnInit() {
    if (this?.currentPersonalInfo?.logoUploadId) {
      const logo = await firstValueFrom(
        this.fileService.toDownloadLink(this.fileService.getDownloadUrl(this.currentPersonalInfo.logoUploadId)),
      );
      this.logoUrl = this.domSanitizer.bypassSecurityTrustUrl(logo);
    }
    if (this?.currentPersonalInfo?.signatureUploadId) {
      const signature = await firstValueFrom(
        this.fileService.toDownloadLink(this.fileService.getDownloadUrl(this.currentPersonalInfo.signatureUploadId)),
      );
      this.signatureUrl = this.domSanitizer.bypassSecurityTrustUrl(signature);
    }
    if (this?.currentPersonalInfo?.initialUploadId) {
      const initial = await firstValueFrom(
        this.fileService.toDownloadLink(this.fileService.getDownloadUrl(this.currentPersonalInfo.initialUploadId)),
      );
      this.initialUrl = this.domSanitizer.bypassSecurityTrustUrl(initial);
    }
    this.form = this.fb.group({
      vatNumber: new UntypedFormControl({ value: this.currentPersonalInfo?.vatNumber, disabled: !this.hasRoleAdmin }, [
        Validators.required,
      ]),
      maxDaysToPay: new UntypedFormControl(
        { value: this.currentPersonalInfo?.maxDaysToPay, disabled: !this.hasRoleAdmin },
        [Validators.required, Validators.min(1)],
      ),
      financeCharge: new UntypedFormControl(
        { value: this.currentPersonalInfo?.financeCharge, disabled: !this.hasRoleAdmin },
        [Validators.required, Validators.min(0)],
      ),
      ceoFullName: new UntypedFormControl(
        { value: this.currentPersonalInfo?.ceoFullName, disabled: !this.hasRoleAdmin },
        [Validators.required],
      ),
      note: new UntypedFormControl({ value: this.currentPersonalInfo?.note, disabled: !this.hasRoleAdmin }, [
        Validators.required,
      ]),
      organizationAddress: new UntypedFormControl(
        {
          value: this.currentPersonalInfo?.organizationAddress,
          disabled: !this.hasRoleAdmin,
        },
        [Validators.required],
      ),
      organizationBankAccount: new UntypedFormControl(
        {
          value: this.currentPersonalInfo?.organizationBankAccount,
          disabled: !this.hasRoleAdmin,
        },
        [Validators.required],
      ),
      organizationBankBIC: new UntypedFormControl(
        {
          value: this.currentPersonalInfo?.organizationBankBIC,
          disabled: !this.hasRoleAdmin,
        },
        [Validators.required],
      ),
      organizationCity: new UntypedFormControl(
        { value: this.currentPersonalInfo?.organizationCity, disabled: !this.hasRoleAdmin },
        [Validators.required],
      ),
      organizationEmailAddress: new UntypedFormControl(
        {
          value: this.currentPersonalInfo?.organizationEmailAddress,
          disabled: !this.hasRoleAdmin,
        },
        [Validators.required],
      ),
      organizationPostCode: new UntypedFormControl(
        {
          value: this.currentPersonalInfo?.organizationPostCode,
          disabled: !this.hasRoleAdmin,
        },
        [Validators.required],
      ),
      organizationName: new UntypedFormControl(
        { value: this.currentPersonalInfo?.organizationName, disabled: !this.hasRoleAdmin },
        [Validators.required],
      ),
      organizationPhoneNumber: new UntypedFormControl(
        {
          value: this.currentPersonalInfo?.organizationPhoneNumber,
          disabled: !this.hasRoleAdmin,
        },
        [Validators.required],
      ),
      logoUpload: new UntypedFormControl(null, []),
      signatureUpload: new UntypedFormControl(null, []),
      initialUpload: new UntypedFormControl(null, []),
      accountants: this.fb.array(this.createAccountants(this.currentPersonalInfo?.accountants || [])),
    });
  }

  private createAccountants(accountants: Accountant[]): UntypedFormGroup[] {
    return accountants?.map(this.convertAccountantToForm);
  }

  addAccountant($event: MouseEvent) {
    $event.preventDefault();
    this.accountants.push(
      this.convertAccountantToForm({
        firstName: '',
        lastName: '',
        email: '',
      }),
    );
  }

  removeAccountant($event: MouseEvent, index: number) {
    if (!this.hasRoleAdmin) {
      return;
    }
    $event.preventDefault();
    this.accountants.removeAt(index);
  }

  get accountants(): UntypedFormArray {
    return this.form.get('accountants') as UntypedFormArray;
  }

  private convertAccountantToForm = (accountant: Accountant): UntypedFormGroup => {
    return new UntypedFormGroup({
      firstName: new UntypedFormControl(
        {
          value: accountant.firstName,
          disabled: !this.hasRoleAdmin,
        },
        [Validators.required],
      ),
      lastName: new UntypedFormControl(
        {
          value: accountant.lastName,
          disabled: !this.hasRoleAdmin,
        },
        [Validators.required],
      ),
      phoneNumber: new UntypedFormControl(
        {
          value: accountant.phoneNumber,
          disabled: !this.hasRoleAdmin,
        },
        [Validators.required],
      ),
      email: new UntypedFormControl(
        {
          value: accountant.email,
          disabled: !this.hasRoleAdmin,
        },
        [Validators.required, Validators.email],
      ),
    });
  };

  send() {
    if (!this.hasRoleAdmin) {
      return;
    }
    const accountants = this.accountants?.controls?.map((c) => {
      return {
        firstName: c.get('firstName').value,
        lastName: c.get('lastName').value,
        phoneNumber: c.get('phoneNumber').value,
        email: c.get('email').value,
      } as Accountant;
    });
    const formData = new FormData();
    formData.append('logo', this.logoUpload);
    formData.append('signature', this.signatureUpload);
    formData.append('initial', this.initialUpload);
    formData.append('vatNumber', this.form.get('vatNumber').value);
    formData.append('ceoFullName', this.form.get('ceoFullName').value);
    formData.append('financeCharge', this.form.get('financeCharge').value);
    formData.append('note', this.form.get('note').value);
    formData.append('organizationAddress', this.form.get('organizationAddress').value);
    formData.append('organizationBankAccount', this.form.get('organizationBankAccount').value);
    formData.append('organizationBankBIC', this.form.get('organizationBankBIC').value);
    formData.append('organizationCity', this.form.get('organizationCity').value);
    formData.append('maxDaysToPay', this.form.get('maxDaysToPay').value);
    formData.append('organizationEmailAddress', this.form.get('organizationEmailAddress').value);
    formData.append('organizationPostCode', this.form.get('organizationPostCode').value);
    formData.append('organizationName', this.form.get('organizationName').value);
    formData.append('organizationPhoneNumber', this.form.get('organizationPhoneNumber').value);
    formData.append('accountants', JSON.stringify(accountants));

    this.onSavePersonalInfo.emit(formData);
    // this.form.reset();
  }
}
