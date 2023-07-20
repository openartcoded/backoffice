import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '@shared/shared.module';
import { UserAreaRoutingModule } from './user-area-routing.module';
import { MemoDateComponent } from './memo-date/memo-date.component';
import { NgbAccordionModule, NgbCollapseModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { MemoDateFormComponent } from './memo-date-form/memo-date-form.component';
import { EditPersonalInfoComponent } from './edit-personal-info/edit-personal-info.component';
import { AutosizeModule } from 'ngx-autosize';
import { NgxFileDropModule } from 'ngx-file-drop';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { ActuatorComponent } from './actuator/actuator.component';
import { ErrorComponent } from './error/error.component';
import { GenericSummaryComponent } from './generic-summary/generic-summary.component';
import { DossierSummaryComponent } from './dossier-summary/dossier-summary.component';
import PlotlyUniversalModule from '@feature/plotly-universal/plotly-universal.module';
import { Html2canvasUniversalModule } from '@feature/html2canvas-universal/html2canvas-universal.module';
import { CompanyStampComponent } from './company-stamp/company-stamp.component';
import { FeeSummaryComponent } from './fee-summary/fee-summary.component';
import { ScriptComponent } from './script/script.component';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { NextTasksComponent } from './next-tasks/next-tasks.component';
import { MostClickedMenuComponent } from './most-clicked-menu/most-clicked-menu.component';
@NgModule({
  declarations: [
    HomeComponent,
    MemoDateComponent,
    MemoDateFormComponent,
    EditPersonalInfoComponent,
    TodoListComponent,
    TodoFormComponent,
    ActuatorComponent,
    FeeSummaryComponent,
    GenericSummaryComponent,
    DossierSummaryComponent,
    ErrorComponent,
    CompanyStampComponent,
    ScriptComponent,
    NextTasksComponent,
    MostClickedMenuComponent,
  ],
  imports: [
    CommonModule,
    UserAreaRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    ScrollingModule,
    FontAwesomeModule,
    NgbCollapseModule,
    FormsModule,
    PlotlyUniversalModule,
    NgbAccordionModule,
    AutosizeModule,
    NgxFileDropModule,
    NgbNavModule,
    Html2canvasUniversalModule
  ],
})
export class UserAreaModule { }
