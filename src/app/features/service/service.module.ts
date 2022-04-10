import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ServiceRoutingModule } from './service-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { FormContactTableComponent } from './form-contact-table/form-contact-table.component';
import { PolicyComponent } from './policy/policy.component';

@NgModule({
  declarations: [ FormContactTableComponent, PolicyComponent],
  imports: [
    CommonModule,
    SharedModule,
    ServiceRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AutosizeModule,
    NgbToastModule,
  ],
})
export class ServiceModule {}
