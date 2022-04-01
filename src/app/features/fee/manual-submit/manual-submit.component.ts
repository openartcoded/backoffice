import { Component, EventEmitter, OnInit, Optional } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { FeeManualForm } from '@core/models/fee';

@Component({
  selector: 'app-manual-submit',
  templateUrl: './manual-submit.component.html',
  styleUrls: ['./manual-submit.component.scss'],
})
export class ManualSubmitComponent implements OnInit {
  manualSubmitForm: FormGroup;
  manualFormSubmitted: EventEmitter<FeeManualForm> = new EventEmitter<FeeManualForm>();

  constructor(private fb: FormBuilder, @Optional() public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.manualSubmitForm = this.fb.group(
      {
        subject: new FormControl('', [Validators.required]),
        body: new FormControl('', [Validators.required]),
        files: new FormControl(null, []),
      },
      {}
    );
  }

  get files(): File[] {
    return this.manualSubmitForm.get('files').value;
  }

  set files(fs: File[]) {
    this.manualSubmitForm.get('files').patchValue(fs);
  }

  drop(files: NgxFileDropEntry[]) {
    if (!this.files?.length) {
      this.files = [];
    }
    for (const droppedFile of files) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.files.push(file);
        this.manualSubmitForm.updateValueAndValidity();
      });
    }
  }

  removeAttachment($event: MouseEvent, a: File) {
    this.files = this.files.filter((f) => f !== a);
    if (!this.files.length) {
      this.files = null;
    }
  }

  submit() {
    const feeManualForm = {
      subject: this.manualSubmitForm.get('subject').value,
      body: this.manualSubmitForm.get('body').value,
      files: this.files,
    };
    this.manualFormSubmitted.emit(feeManualForm);
    this.manualSubmitForm.reset();
  }
}
