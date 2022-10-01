import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadTableComponent } from './file-upload-table/file-upload-table.component';
import { SharedModule } from '@shared/shared.module';
import { FileUploadRoutingModule } from './file-upload-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbCollapseModule, NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadSearchFormComponent } from './file-upload-search-form/file-upload-search-form.component';
import {CalendarModule} from 'primeng/calendar';
@NgModule({
  declarations: [FileUploadTableComponent, FileUploadSearchFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    FileUploadRoutingModule,
    FontAwesomeModule,
    NgbPaginationModule,
    FormsModule,
    CalendarModule,
    NgbCollapseModule,
    ReactiveFormsModule,
    NgbDropdownModule,
  ],
})
export class FileUploadModule {}
