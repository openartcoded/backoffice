import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Html2canvasService } from '@core/service/html2canvas.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: []
})
export class Html2canvasUniversalModule {
  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      import('html2canvas').then(module => {
        Html2canvasService.html2canvas = module.default;
      });
    }
  
  }


 }
