import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentResultComponent } from './document-result/document-result.component';
import { SharedModule } from '@shared/shared.module';
import { NgbCollapseModule, NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdministrativeDocumentRoutingModule } from '@feature/administrative-document/file-upload-routing.module';
import { DocumentEditorComponent } from './document-editor/document-editor.component';
import { AutosizeModule } from 'ngx-autosize';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ChipsModule } from 'primeng/chips';
import { DocumentSearchFormComponent } from './document-search-form/document-search-form.component';
import { SplitPdfComponent } from './split-pdf/split-pdf.component';

@NgModule({
  declarations: [DocumentResultComponent, DocumentEditorComponent, DocumentSearchFormComponent, SplitPdfComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbPaginationModule,
    AdministrativeDocumentRoutingModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AutosizeModule,
    NgxFileDropModule,
    ChipsModule,
    NgbCollapseModule,
    NgbDropdownModule,
  ],
})
export class AdministrativeDocumentModule {}
