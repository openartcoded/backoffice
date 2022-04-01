import { Component, EventEmitter, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { AdministrativeDocument, AdministrativeDocumentForm } from '@core/models/administrative-document';

@Component({
  selector: 'app-document-editor',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.scss'],
})
export class DocumentEditorComponent implements OnInit {
  form: FormGroup;
  @Input()
  adminDoc: AdministrativeDocument;
  formSubmitted: EventEmitter<AdministrativeDocumentForm> = new EventEmitter<AdministrativeDocumentForm>();

  constructor(private fb: FormBuilder, @Optional() public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        id: new FormControl(this.adminDoc.id, []),
        title: new FormControl(this.adminDoc.title, [Validators.required]),
        description: new FormControl(this.adminDoc.description, [Validators.required]),
        tags: new FormControl(this.adminDoc.tags || [], []),
        document: new FormControl(null, []),
      },
      {}
    );
  }

  get document(): File {
    return this.form.get('document').value;
  }

  set document(fs: File) {
    this.form.get('document').patchValue(fs);
  }

  drop(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.document = file;
        this.form.updateValueAndValidity();
      });
    }
  }

  submit() {
    const submitForm = {
      title: this.form.get('title').value,
      id: this.form.get('id').value,
      description: this.form.get('description').value,
      tags: this.form.get('tags').value,
      document: this.document,
    };
    this.formSubmitted.emit(submitForm);
    this.form.reset();
  }
}
