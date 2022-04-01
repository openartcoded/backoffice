import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoicePageComponent } from './invoice-page/invoice-page.component';
import { SharedModule } from '@shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbPaginationModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceTableResultComponent } from './invoice-table-result/invoice-table-result.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { CurrentBilltoComponent } from './current-billto/current-billto.component';
import { TemplateComponent } from './template/template.component';
import { SummaryComponent } from './summary/summary.component';
import PlotlyUniversalModule from '@feature/plotly-universal/plotly-universal.module';

@NgModule({
  declarations: [
    InvoicePageComponent,
    InvoiceDetailComponent,
    InvoiceTableResultComponent,
    CurrentBilltoComponent,
    TemplateComponent,
    SummaryComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    InvoiceRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    FormsModule,
    PlotlyUniversalModule,
    NgbPaginationModule,
    NgbNavModule,
    NgxFileDropModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de' }],
})
export class InvoiceModule {}
