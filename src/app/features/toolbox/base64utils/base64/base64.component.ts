import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-base64',
  templateUrl: './base64.component.html',
  styleUrls: ['./base64.component.scss'],
})
export class Base64Component implements OnInit {
  @Input()
  decode: boolean;
  base64Form: FormGroup;
  result: string;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRefService: WindowRefService,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    let pageType = this.decode ? 'decoder' : 'encoder';
    this.titleService.setTitle(`Base64 ${pageType}`);
    this.metaService.updateTag({
      name: 'description',
      content: `Online Base64 ${pageType}`,
    });

    this.base64Form = this.fb.group(
      {
        inputText: new FormControl('', [Validators.required]),
      },
      {}
    );
  }

  get inputText(): string {
    return this.base64Form.get('inputText').value;
  }

  submit() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        if (this.decode) {
          this.result = this.b64ToUtf8(this.inputText);
        } else {
          this.result = this.utf8ToB64(this.inputText);
        }
      } catch (e) {
        this.windowRefService.nativeWindow.alert(e);
      }
    }
  }

  utf8ToB64(str): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.windowRefService.nativeWindow.btoa(unescape(encodeURIComponent(str)));
    }
  }

  b64ToUtf8(str): string {
    if (isPlatformBrowser(this.platformId)) {
      return decodeURIComponent(escape(this.windowRefService.nativeWindow.atob(str)));
    }
  }
}
