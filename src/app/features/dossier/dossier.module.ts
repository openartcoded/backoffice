import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DossierPageComponent } from './dossier-page/dossier-page.component';
import { SharedModule } from '@shared/shared.module';
import { DossierRoutingModule } from './dossier-routing.module';
import { NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DossierTableResultComponent } from './dossier-table-result/dossier-table-result.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DossierFormComponent } from './dossier-form/dossier-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { DossierImportFormComponent } from './dossier-import-form/dossier-import-form.component';

@NgModule({
  declarations: [DossierPageComponent, DossierTableResultComponent, DossierFormComponent, DossierImportFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    DossierRoutingModule,
    NgbNavModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    AutosizeModule,
    NgbTooltipModule,
    NgbDropdownModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de' }],
})
export class DossierModule {}
