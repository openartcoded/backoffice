import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RdfService } from '@core/service/rdf.service';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { map } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-shacl-validation',
  templateUrl: './shacl-validation.component.html',
  styleUrls: ['./shacl-validation.component.scss'],
})
export class ShaclValidationComponent implements OnInit {
  allowedExtensions: string;
  shaclForm: UntypedFormGroup;
  valid: boolean;
  errorMessage: string;

  constructor(
    private fb: UntypedFormBuilder,
    private titleService: Title,
    private metaService: Meta,
    private rdfService: RdfService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Shacl Validation');
    this.metaService.updateTag({
      name: 'description',
      content: `Online Shacl validator`,
    });

    this.rdfService
      .getAllowedExtensions()
      .pipe(map((dt) => dt.map((it) => '.' + it).join(', ')))
      .subscribe((ext) => {
        this.allowedExtensions = ext;
        this.shaclForm = this.fb.group(
          {
            modelFile: new UntypedFormControl(null, [Validators.required]),
            shaclFile: new UntypedFormControl(null, [Validators.required]),
          },
          {}
        );
      });
  }

  get selectedLanguage(): string {
    return this.shaclForm.get('selectedLanguage').value;
  }

  get modelFile() {
    return this.shaclForm.get('modelFile').value;
  }

  set modelFile(file) {
    this.shaclForm.get('modelFile').patchValue(file);
  }

  get shaclFile() {
    return this.shaclForm.get('shaclFile').value;
  }

  set shaclFile(file) {
    this.shaclForm.get('shaclFile').patchValue(file);
  }

  drop($event: NgxFileDropEntry[], fileType: string) {
    for (const droppedFile of $event) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        switch (fileType) {
          case 'shaclFile':
            this.shaclFile = file;
            break;
          case 'modelFile':
            this.modelFile = file;
            break;
        }
      });
    }
  }

  submit() {
    this.valid = false;
    this.errorMessage = null;
    this.rdfService.shaclValidation(this.modelFile, this.shaclFile).subscribe(
      (resp) => {
        this.valid = true;
        this.shaclForm.reset();
      },
      (error) => {
        this.errorMessage = error.error;
        this.shaclForm.reset();
      }
    );
  }
}
