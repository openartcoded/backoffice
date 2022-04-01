import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PwaModalComponent } from './pwa-modal/pwa-modal.component';
import { NotificationComponent } from './notification/notification.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppSettingsComponent } from './app-settings/app-settings.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { AutosizeModule } from 'ngx-autosize';
import { NgxFileDropModule } from 'ngx-file-drop';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    PwaModalComponent,
    NotificationComponent,
    AppSettingsComponent,
    UserMenuComponent,
  ],
  exports: [NavbarComponent, SidebarComponent],
  imports: [
    CommonModule,
    NgbNavModule,
    HttpClientModule,
    ReactiveFormsModule,
    AutosizeModule,
    NgbCollapseModule,
    RouterModule,
    SharedModule,
    FontAwesomeModule,
    NgxFileDropModule,
    NgbDropdownModule,
    NgbPopoverModule,
    ScrollingModule,
    FormsModule,
  ],
})
export class LayoutModule {}
