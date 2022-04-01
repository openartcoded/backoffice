import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DossierPageComponent } from './dossier-page/dossier-page.component';
import { SharedModule } from '@shared/shared.module';
import { DossierRoutingModule } from './dossier-routing.module';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DossierTableResultComponent } from './dossier-table-result/dossier-table-result.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DossierFormComponent } from './dossier-form/dossier-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { SummaryComponent } from './summary/summary.component';
import PlotlyUniversalModule from '@feature/plotly-universal/plotly-universal.module';

@NgModule({
  declarations: [DossierPageComponent, DossierTableResultComponent, DossierFormComponent, SummaryComponent],
  imports: [
    CommonModule,
    SharedModule,
    DossierRoutingModule,
    NgbNavModule,
    FontAwesomeModule,
    PlotlyUniversalModule,
    ReactiveFormsModule,
    FormsModule,
    AutosizeModule,
    NgbDropdownModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de' }],
})
export class DossierModule {}
