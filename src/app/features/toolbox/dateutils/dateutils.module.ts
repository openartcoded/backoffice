import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateManipulationComponent } from './date-manipulation/date-manipulation.component';
import { DateUtilsRoutingModule } from './dateutils-routing.module';
import { SharedModule } from '@shared/shared.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HowManyComponent } from './how-many/how-many.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DateBetweenComponent } from './date-between/date-between.component';
import { BusinessDaysComponent } from './business-days/business-days.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [DateManipulationComponent, HowManyComponent, DateBetweenComponent, BusinessDaysComponent],
  imports: [CommonModule, DateUtilsRoutingModule, SharedModule, NgbNavModule, ReactiveFormsModule, FontAwesomeModule],
})
export class DateUtilsModule {}
