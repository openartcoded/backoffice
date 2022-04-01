import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GdprService } from '@core/service/gdpr.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
})
export class PolicyComponent implements OnInit {
  constructor(private titleService: Title, private gdprService: GdprService) {}

  ngOnInit(): void {
    this.titleService.setTitle('Privacy Policy');
  }

  gdprConsent() {
    return this.gdprService.gdprConsent();
  }

  toggleConsent($event: any) {
    let checked = $event.target.checked;
    this.gdprService.toggleConsent(checked);
  }
}
