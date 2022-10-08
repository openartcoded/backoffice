import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeePageComponent } from './fee-page/fee-page.component';
import { SharedModule } from '@shared/shared.module';
import { FeeRoutingModule } from './fee-routing.module';
import { NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FeeSearchFormComponent } from './fee-search-form/fee-search-form.component';
import { FeeTableResultComponent } from './fee-table-result/fee-table-result.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagFormComponent } from './tag-form/tag-form.component';
import { FeeDetailComponent } from './fee-detail/fee-detail.component';
import { AutosizeModule } from 'ngx-autosize';
import { FeeProcessValidationComponent } from './fee-process-validation/fee-process-validation.component';
import { ManualSubmitComponent } from './manual-submit/manual-submit.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { UpdatePriceComponent } from './update-price/update-price.component';
import { DefaultPriceComponent } from './default-price/default-price.component';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FeeSummaryComponent } from './fee-summary/fee-summary.component';
import PlotlyUniversalModule from '@feature/plotly-universal/plotly-universal.module';
@NgModule({
  declarations: [
    FeePageComponent,
    FeeSearchFormComponent,
    FeeTableResultComponent,
    TagFormComponent,
    FeeDetailComponent,
    FeeProcessValidationComponent,
    ManualSubmitComponent,
    UpdatePriceComponent,
    DefaultPriceComponent,
    FeeSummaryComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FeeRoutingModule,
    ColorPickerModule,
    NgbNavModule,
    NgbCollapseModule,
    FontAwesomeModule,
    NgbTooltipModule,
    PlotlyUniversalModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    FormsModule,
    AutosizeModule,
    NgxFileDropModule,
    NgbDropdownModule,
  ],
})
export class FeeModule {}
