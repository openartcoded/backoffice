import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadTableComponent } from './file-upload-table/file-upload-table.component';
import { SharedModule } from '@shared/shared.module';
import { FileUploadRoutingModule } from './file-upload-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadSearchFormComponent } from './file-upload-search-form/file-upload-search-form.component';
import { FileUploadPageComponent } from './file-upload-page/file-upload-page.component';
import { FileSearchTabComponent } from './file-search-tab/file-search-tab.component';
@NgModule({
  declarations: [FileUploadTableComponent, FileUploadSearchFormComponent, FileUploadPageComponent, FileSearchTabComponent],
  imports: [
    CommonModule,
    SharedModule,
    FileUploadRoutingModule,
    FontAwesomeModule,
    NgbPaginationModule,
    FormsModule,
    NgbCollapseModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbNavModule,
  ],
})
export class FileUploadModule {}
