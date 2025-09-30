import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { Memz } from '@core/models/memz';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { MemzService } from '@core/service/memz.service';
import { DateUtils } from '@core/utils/date-utils';

@Component({
    selector: 'app-memagram-editor',
    templateUrl: './memagram-editor.component.html',
    styleUrls: ['./memagram-editor.component.scss'],
    standalone: false
})
export class MemagramEditorComponent implements OnInit {
  @Input()
  meme: Memz;
  public editorForm: UntypedFormGroup;
  url: any;
  loading: boolean = false;

  @Output()
  saved: EventEmitter<Memz> = new EventEmitter<Memz>();

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private memzService: MemzService,
    private formBuilder: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    this.editorForm = this.createFormGroup(this.meme);
  }

  send() {
    this.loading = true;
    const formData = new FormData();
    const dateOfVisibility = this.editorForm.get('dateOfVisibility').value;
    formData.append('id', this.meme.id);
    formData.append('visible', this.editorForm.get('visible').value);
    formData.append('title', this.editorForm.get('title').value);
    if (dateOfVisibility) {
      formData.append('dateOfVisibility', DateUtils.getDateFromInput(dateOfVisibility).toUTCString());
    }
    formData.append('imageUpload', this.imageUpload);
    formData.append('description', this.editorForm.get('description').value);
    this.memzService.save(formData).subscribe((data) => {
      this.editorForm.reset();
      this.loading = false;
      this.saved.emit(data);
      this.activeModal?.close();
    });
  }

  get visible(): boolean {
    return this.editorForm.get('visible').value;
  }

  get imageUpload(): File {
    return this.editorForm.get('imageUpload').value;
  }

  set imageUpload(file: File) {
    this.editorForm.get('imageUpload').patchValue(file);
  }

  drop($event: NgxFileDropEntry[]) {
    for (const droppedFile of $event) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.imageUpload = file;
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.url = event.target.result;
        };
        reader.onerror = (event: any) => {
          console.log('File could not be read: ' + event.target.error.code);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  createFormGroup(meme: Memz): UntypedFormGroup {
    if (meme.imageUploadId && meme.imageLink) {
      this.url = meme.imageLink;
    }
    let dateOfVisibility = DateUtils.toDateOrNow(meme.dateOfVisibility);
    let formattedDateOfVisibility = DateUtils.formatInputDateTime(dateOfVisibility);
    return this.formBuilder.group({
      title: new UntypedFormControl(meme.title, [Validators.required]),
      description: new UntypedFormControl(meme.description, []),
      id: new UntypedFormControl(meme.id, []),
      dateOfVisibility: new UntypedFormControl(formattedDateOfVisibility, [Validators.required]),
      visible: new UntypedFormControl(meme.visible === null || meme.visible === undefined ? false : meme.visible, []),
      imageUpload: new UntypedFormControl(null, []),
    });
  }
}
