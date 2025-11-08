import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeePageComponent } from './fee-page/fee-page.component';
import { SharedModule } from '@shared/shared.module';
import { FeeRoutingModule } from './fee-routing.module';
import {
    NgbCollapseModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
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
import { DefaultPriceComponent } from './default-price/default-price.component';
import { ColorPickerModule } from 'primeng/colorpicker';
import { PlotlyViaCDNModule } from 'angular-plotly.js';
import { FeeEditComponent } from './fee-edit/fee-edit.component';
import { UpdatePriceComponent } from './update-price/update-price.component';
@NgModule({
    declarations: [
        FeePageComponent,
        FeeSearchFormComponent,
        FeeTableResultComponent,

        FeeProcessValidationComponent,
        ManualSubmitComponent,
        DefaultPriceComponent,
        FeeEditComponent,
    ],
    imports: [
        CommonModule,
        TagFormComponent, UpdatePriceComponent,
        SharedModule,
        FeeRoutingModule,
        ColorPickerModule,
        NgbNavModule,
        NgbCollapseModule,
        FontAwesomeModule,
        NgbTooltipModule,
        PlotlyViaCDNModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        FormsModule,
        AutosizeModule,
        NgxFileDropModule,
        NgbDropdownModule,
    ],
})
export class FeeModule { }
