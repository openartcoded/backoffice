import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '@core/service/auth.service';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigInitService } from '@init/config-init.service';
import { PersonalInfo } from '@core/models/personal.info';
import { EditPersonalInfoComponent } from '@feature/user-area/edit-personal-info/edit-personal-info.component';
import { ToastService } from '@core/service/toast.service';
import { firstValueFrom } from 'rxjs';
import { SmsFormComponent } from '@shared/sms-form/sms-form.component';
import { SmsService } from '@core/service/sms.service';
import { Sms } from '@core/models/sms';
import { User } from '@core/models/user';

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  standalone: false,
})
export class UserMenuComponent implements OnInit {
  frontOfficeUrl: string;
  @Input()
  user: User;

  get hasRoleAdmin(): boolean {
    return this.user.authorities.includes('ADMIN');
  }
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any,

    private personalInfoService: PersonalInfoService,
    private configService: ConfigInitService,
    private toastService: ToastService,
    private smsService: SmsService,
    private modalService: NgbModal,
    private authenticationService: AuthService,
  ) {}

  ngOnInit(): void {
    const config = this.configService.getConfig();
    this.frontOfficeUrl = config['FRONTEND_URL'];
  }
  logout() {
    this.authenticationService.logout();
  }

  async openPersonalInfoModal() {
    const personalInfo: PersonalInfo = await firstValueFrom(this.personalInfoService.get());
    const oldDemoMode = personalInfo.demoMode;
    const modal = this.modalService.open(EditPersonalInfoComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modal.componentInstance.user = this.user;
    modal.componentInstance.currentPersonalInfo = personalInfo;
    modal.componentInstance.onSavePersonalInfo.subscribe(async (formData: any) => {
      //modal.close();
      const res = await firstValueFrom(this.personalInfoService.save(formData));
      this.toastService.showSuccess('Personal Information updated');
      if (oldDemoMode !== res.demoMode && isPlatformBrowser(this.platformId)) {
        this.document.location.reload();
      }
    });
  }
  async openSmsModal() {
    const modal = this.modalService.open(SmsFormComponent, {
      size: 'lg',
    });
    modal.componentInstance.sendSms.subscribe(async (sms: Sms) => {
      modal.close();
      await firstValueFrom(this.smsService.send(sms));
      this.toastService.showSuccess('Sms sent');
    });
  }
}
