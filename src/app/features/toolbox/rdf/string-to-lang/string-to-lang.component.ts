import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { RdfService } from '@core/service/rdf.service';
import { Meta, Title } from '@angular/platform-browser';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-string-to-lang',
    templateUrl: './string-to-lang.component.html',
    styleUrls: ['./string-to-lang.component.scss'],
    standalone: false
})
export class StringToLangComponent implements OnInit {
  stringToLangForm: UntypedFormGroup;
  allowedLanguages$: Observable<string[]>;
  result: string;

  constructor(
    private fb: UntypedFormBuilder,
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRefService: WindowRefService,
    private rdfService: RdfService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('RDF String to lang conversion (TURTLE, N3, JSON-LD)');
    this.metaService.updateTag({
      name: 'description',
      content: `Online RDF conversion`,
    });

    this.allowedLanguages$ = this.rdfService.getAllowedLanguages();
    this.stringToLangForm = this.fb.group(
      {
        modelLang: new UntypedFormControl('', [Validators.required]),
        selectedLanguage: new UntypedFormControl('', [Validators.required]),
        rdfInput: new UntypedFormControl('', [Validators.required]),
      },
      {}
    );
  }

  get rdfInput(): string {
    return this.stringToLangForm.get('rdfInput').value;
  }

  get selectedLanguage(): string {
    return this.stringToLangForm.get('selectedLanguage').value;
  }

  get modelLang(): string {
    return this.stringToLangForm.get('modelLang').value;
  }

  submit() {
    if (isPlatformBrowser(this.platformId)) {
      this.rdfService.modelToLang(this.rdfInput, this.modelLang, this.selectedLanguage).subscribe(
        (res) => {
          this.result = res;
        },
        (error) => this.windowRefService.nativeWindow.alert('error: ' + error.error)
      );
    }
  }
}
