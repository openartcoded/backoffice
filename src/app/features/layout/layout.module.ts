import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import {
  NgbCollapseModule,
  NgbDropdownModule,
  NgbNavModule,
  NgbPopoverModule,
  NgbToastModule,
  NgbTooltipModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
import { ToastsContainer } from './toasts/toasts-container';
import { CacheComponent } from './cache/cache.component';

@NgModule({ declarations: [
        SidebarComponent,
        NavbarComponent,
        PwaModalComponent,
        NotificationComponent,
        AppSettingsComponent,
        ToastsContainer,
        UserMenuComponent,
        CacheComponent,
    ],
    exports: [NavbarComponent, SidebarComponent, ToastsContainer], imports: [CommonModule,
        NgbNavModule,
        ReactiveFormsModule,
        NgbTypeaheadModule,
        AutosizeModule,
        NgbCollapseModule,
        NgbToastModule,
        RouterModule,
        SharedModule,
        FontAwesomeModule,
        NgxFileDropModule,
        NgbTooltipModule,
        NgbDropdownModule,
        NgbPopoverModule,
        ScrollingModule,
        FormsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class LayoutModule {}
