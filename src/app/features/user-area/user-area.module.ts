import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
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

@NgModule({
  declarations: [
    HomeComponent,
    MemoDateComponent,
    MemoDateFormComponent,
    EditPersonalInfoComponent,
    TodoListComponent,
    TodoFormComponent,
    ActuatorComponent,
  ],
  imports: [
    CommonModule,
    UserAreaRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FontAwesomeModule,
    NgbCollapseModule,
    NgbAccordionModule,
    AutosizeModule,
    NgxFileDropModule,
    NgbNavModule,
  ],
})
export class UserAreaModule {}
