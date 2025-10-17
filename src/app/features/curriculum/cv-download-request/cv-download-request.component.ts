import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CvService } from '@core/service/cv.service';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';
import { DownloadCvRequest } from '@core/models/curriculum';

@Component({
  selector: 'app-cv-download-request',
  templateUrl: './cv-download-request.component.html',
  styleUrls: ['./cv-download-request.component.scss'],
  standalone: false,
})
export class CvDownloadRequestComponent implements OnInit {
  cvDownloadRequests: DownloadCvRequest[];

  constructor(
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRefService: WindowRefService,
    private cvService: CvService,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('CV Requests');
    this.load();
  }

  load() {
    this.cvService
      .getDownloadCvRequests()
      .subscribe((cvDownloadRequests) => (this.cvDownloadRequests = cvDownloadRequests));
  }

  delete(cvDr: DownloadCvRequest) {
    if (isPlatformBrowser(this.platformId)) {
      let resp = this.windowRefService.nativeWindow.confirm('Are you sure you want to delete this row? ');
      if (resp) {
        this.cvService.deleteDownloadRequest(cvDr).subscribe((d) => {
          this.load();
        });
      }
    }
  }
}
