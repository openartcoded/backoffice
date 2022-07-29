import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output, PLATFORM_ID } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '@core/service/file.service';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { InvoiceFreemarkerTemplate } from '@core/models/invoice';
import { firstValueFrom, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { WindowRefService } from '@core/service/window.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
})
export class TemplateComponent implements OnInit {
  @Input()
  templates$: Observable<InvoiceFreemarkerTemplate[]>;

  @Output()
  onSaveTemplate: EventEmitter<FormData> = new EventEmitter<FormData>();
  @Output()
  onDeleteTemplate: EventEmitter<InvoiceFreemarkerTemplate> = new EventEmitter<InvoiceFreemarkerTemplate>();

  form: UntypedFormGroup;
  url: any;

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private fileService: FileService,
    private fb: UntypedFormBuilder,
    private windowService: WindowRefService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  drop($event: NgxFileDropEntry[]) {
    for (const droppedFile of $event) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.template = file;
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.url = file.name;
        };
        reader.onerror = (event: any) => {
          console.log('File could not be read: ' + event.target.error.code);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  get template(): File {
    return this.form.get('template').value;
  }

  set template(file: File) {
    this.form.get('template').patchValue(file);
  }

  async ngOnInit() {
    this.form = this.fb.group({
      name: new UntypedFormControl('', [Validators.required]),
      template: new UntypedFormControl(null, []),
    });
  }

  send() {
    const formData = new FormData();
    formData.append('template', this.template);
    formData.append('name', this.form.get('name').value);
    this.onSaveTemplate.emit(formData);
    this.form.reset();
  }

  removeTemplate($event: any, t: InvoiceFreemarkerTemplate) {
    $event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      let resp = this.windowService.nativeWindow.confirm('Are you sure you want to delete this row? ');
      if (resp) {
        this.onDeleteTemplate.emit(t);
      }
    }
  }

  async downloadTemplate($event: any, t: InvoiceFreemarkerTemplate) {
    let fileUpload = await firstValueFrom(this.fileService.findById(t.templateUploadId));
    this.fileService.download(fileUpload);
  }
}
