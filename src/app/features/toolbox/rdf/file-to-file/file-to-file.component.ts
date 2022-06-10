import { Component, OnInit } from '@angular/core';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { RdfService } from '@core/service/rdf.service';
import { map } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-file-to-file',
  templateUrl: './file-to-file.component.html',
  styleUrls: ['./file-to-file.component.scss'],
})
export class FileToFileComponent implements OnInit {
  fileToFileForm: UntypedFormGroup;
  allowedLanguages$: Observable<string[]>;
  allowedExtensions: string;

  constructor(
    private fb: UntypedFormBuilder,
    private titleService: Title,
    private metaService: Meta,
    private rdfService: RdfService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('RDF file conversion');
    this.metaService.updateTag({
      name: 'description',
      content: `Resource description framework file conversion online (RDF, JSON-LD, Turtle, Trig,...)`,
    });

    this.allowedLanguages$ = this.rdfService.getAllowedLanguages();
    this.rdfService
      .getAllowedExtensions()
      .pipe(map((dt) => dt.map((it) => '.' + it).join(', ')))
      .subscribe((ext) => {
        this.allowedExtensions = ext;
        this.fileToFileForm = this.fb.group(
          {
            selectedLanguage: new UntypedFormControl('', [Validators.required]),
            file: new UntypedFormControl(null, [Validators.required]),
          },
          {}
        );
      });
  }

  get selectedLanguage(): string {
    return this.fileToFileForm.get('selectedLanguage').value;
  }

  get file() {
    return this.fileToFileForm.get('file').value;
  }

  set file(file) {
    this.fileToFileForm.get('file').patchValue(file);
  }

  drop(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.file = file;
      });
    }
  }

  submit() {
    this.rdfService.fileToFile(this.file, this.selectedLanguage);
    this.fileToFileForm.reset();
  }
}
