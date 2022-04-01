import { Component, OnInit } from '@angular/core';
import { GdprService } from '@core/service/gdpr.service';

@Component({
  selector: 'app-gdpr',
  templateUrl: './gdpr.component.html',
  styleUrls: ['./gdpr.component.scss'],
})
export class GdprComponent implements OnInit {
  displayBanner: boolean;

  constructor(private gdprService: GdprService) {}

  ngOnInit(): void {
    this.displayBanner = this.gdprService.gdprConsent();
  }

  accepted() {
    this.gdprService.toggleConsent(true);
  }

  gdprConsent() {
    return this.gdprService.gdprConsent();
  }
}
