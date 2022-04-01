import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { Memz } from '@core/models/memz';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { FileService } from '@core/service/file.service';
import { MemzService } from '@core/service/memz.service';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-memagram-editor',
  templateUrl: './memagram-editor.component.html',
  styleUrls: ['./memagram-editor.component.scss'],
})
export class MemagramEditorComponent implements OnInit {
  @Input()
  meme: Memz;
  public editorForm: FormGroup;
  url: any;
  loading: boolean = false;

  @Output()
  saved: EventEmitter<Memz> = new EventEmitter<Memz>();

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private fileService: FileService,
    private memzService: MemzService,
    private formBuilder: FormBuilder
  ) {}

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

  createFormGroup(meme: Memz): FormGroup {
    if (meme.imageUploadId && meme.imageLink) {
      this.url = meme.imageLink;
    }
    let dateOfVisibility = DateUtils.toDateOrNow(meme.dateOfVisibility);
    let formattedDateOfVisibility = DateUtils.formatInputDateTime(dateOfVisibility);
    return this.formBuilder.group({
      title: new FormControl(meme.title, [Validators.required]),
      description: new FormControl(meme.description, []),
      id: new FormControl(meme.id, []),
      dateOfVisibility: new FormControl(formattedDateOfVisibility, [Validators.required]),
      visible: new FormControl(meme.visible === null || meme.visible === undefined ? false : meme.visible, []),
      imageUpload: new FormControl(null, []),
    });
  }
}
