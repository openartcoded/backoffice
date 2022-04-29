import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { InfoService } from '@core/service/info.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private titleService: Title, private infoService: InfoService) {}

  async ngOnInit() {
    await this.setTitle();
  }

  async setTitle() {
    const backendInfo = await firstValueFrom(this.infoService.getBuildInfo());
    this.titleService.setTitle('BackOffice - ' + backendInfo.build.version);
  }
}
