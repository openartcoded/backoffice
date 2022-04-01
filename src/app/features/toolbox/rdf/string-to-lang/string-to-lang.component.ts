import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { RdfService } from '@core/service/rdf.service';
import { Meta, Title } from '@angular/platform-browser';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-string-to-lang',
  templateUrl: './string-to-lang.component.html',
  styleUrls: ['./string-to-lang.component.scss'],
})
export class StringToLangComponent implements OnInit {
  stringToLangForm: FormGroup;
  allowedLanguages$: Observable<string[]>;
  result: string;

  constructor(
    private fb: FormBuilder,
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
        modelLang: new FormControl('', [Validators.required]),
        selectedLanguage: new FormControl('', [Validators.required]),
        rdfInput: new FormControl('', [Validators.required]),
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
