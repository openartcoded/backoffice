import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PersonalInfo } from '@core/models/personal.info';
import { FileService } from '@core/service/file.service';
import { Html2canvasService } from '@core/service/html2canvas.service';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-company-stamp',
  templateUrl: './company-stamp.component.html',
  styleUrls: ['./company-stamp.component.scss'],
})
export class CompanyStampComponent implements OnInit {
  @ViewChild('companyStamp')
  screen: ElementRef;
  personalInfo: PersonalInfo;
  logo: any;

  imageName: string = "company_stamp";

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  constructor(
    private fileService: FileService,
    private domSanitizer: DomSanitizer,
    private html2canvasService: Html2canvasService,
    private personalInfoService: PersonalInfoService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  async ngOnInit() {
    this.personalInfo = await firstValueFrom(this.personalInfoService.get());
    const logoUrl = await firstValueFrom(
      this.fileService.toDownloadLink(this.fileService.getDownloadUrl(this.personalInfo.logoUploadId))
    );
    this.logo = this.domSanitizer.bypassSecurityTrustUrl(logoUrl.href);
    this.cdr.markForCheck();

  }

  downloadImage() {
    if (this.isBrowser) {
      this.html2canvasService.html2canvas(this.screen.nativeElement, { backgroundColor: null}).then((canvas) => {
        this.canvas.nativeElement.src = canvas.toDataURL();
        this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
        this.downloadLink.nativeElement.download = `${this.imageName}.png`;
        this.downloadLink.nativeElement.click();
      });
    }
  }
  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }
}
