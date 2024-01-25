import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AutosizeModule } from 'ngx-autosize';
import { NgbDropdownModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MailRoutingModule } from './mail-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MailPageComponent } from './mail-page/mail-page.component';
import { MailDetailComponent } from './mail-detail/mail-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChipsModule } from 'primeng/chips';
@NgModule({
  declarations: [MailPageComponent, MailDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    MailRoutingModule,
    FontAwesomeModule,
    AutosizeModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbNavModule,
    ReactiveFormsModule,
    FormsModule,
    ChipsModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de' }],
})
export class MailModule { }
