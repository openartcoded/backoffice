import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillableClientTableComponent } from './billable-client-table/billable-client-table.component';
import { SharedModule } from '@shared/shared.module';
import { BillableClientRoutingModule } from './billable-client-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AutosizeModule } from 'ngx-autosize';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BillableClientDetailComponent } from './billable-client-detail/billable-client-detail.component';



@NgModule({
  declarations: [
    BillableClientTableComponent,
    BillableClientDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BillableClientRoutingModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AutosizeModule,
    NgxFileDropModule,
    NgbCollapseModule,
    NgbDropdownModule,
  ]
})
export class BillableClientModule { }
