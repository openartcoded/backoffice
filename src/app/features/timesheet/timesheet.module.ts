import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimesheetsComponent } from './timesheets/timesheets.component';
import { TimesheetDetailComponent } from './timesheet-detail/timesheet-detail.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { ChipsModule } from 'primeng/chips';
import { NgxFileDropModule } from 'ngx-file-drop';
import { TimesheetRoutingModule } from '@feature/timesheet/timesheet-routing.module';
import { PeriodFormComponent } from './period-form/period-form.component';
import { AutosizeModule } from 'ngx-autosize';
import { TimesheetSettingsComponent } from './timesheet-settings/timesheet-settings.component';

@NgModule({
  declarations: [TimesheetsComponent, TimesheetDetailComponent, PeriodFormComponent, TimesheetSettingsComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    SharedModule,
    ChipsModule,
    NgbPaginationModule,
    TimesheetRoutingModule,
    FormsModule,
    NgbCarouselModule,
    NgxFileDropModule,
    NgbNavModule,
    AutosizeModule,
  ],
})
export class TimesheetModule {}
