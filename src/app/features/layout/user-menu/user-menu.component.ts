import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/service/auth.service';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigInitService } from '@init/config-init.service';
import { PersonalInfo } from '@core/models/personal.info';
import { EditPersonalInfoComponent } from '@feature/user-area/edit-personal-info/edit-personal-info.component';
import { ToastService } from '@core/service/toast.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
  frontOfficeUrl: string;

  constructor(
    private personalInfoService: PersonalInfoService,
    private configService: ConfigInitService,
    private toastService: ToastService,

    private modalService: NgbModal,
    private authenticationService: AuthService
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
    const modal = this.modalService.open(EditPersonalInfoComponent, {
      size: 'lg',
    });
    modal.componentInstance.currentPersonalInfo = personalInfo;
    modal.componentInstance.onSavePersonalInfo.subscribe(async (formData) => {
      //modal.close();
      await firstValueFrom(this.personalInfoService.save(formData));
      this.toastService.showSuccess('Personal Information updated');
    });
  }
}
