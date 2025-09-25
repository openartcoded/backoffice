import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoicePageComponent } from './invoice-page/invoice-page.component';
import { SharedModule } from '@shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbPaginationModule,
    NgbNavModule,
    NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { InvoiceTableResultComponent } from './invoice-table-result/invoice-table-result.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { TemplateComponent } from './template/template.component';
import { AutosizeModule } from 'ngx-autosize';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';

@NgModule({
    declarations: [InvoicePageComponent, InvoiceDetailComponent, InvoiceTableResultComponent, TemplateComponent],
    imports: [
        CommonModule,
        SharedModule,
        InvoiceRoutingModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        NgbDatepickerModule,
        AutosizeModule,
        NgbTooltipModule,
        NgbDropdownModule,
        FormsModule,
        NgbPaginationModule,
        NgbNavModule,
        NgxFileDropModule,
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'de' }],
})
export class InvoiceModule { }
