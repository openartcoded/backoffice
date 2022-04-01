import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '@shared/shared.module';
import { ServiceRoutingModule } from './service-routing.module';
import { FormContactComponent } from './form-contact/form-contact.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { FormContactTableComponent } from './form-contact-table/form-contact-table.component';
import { PolicyComponent } from './policy/policy.component';

@NgModule({
  declarations: [HomePageComponent, FormContactComponent, FormContactTableComponent, PolicyComponent],
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
