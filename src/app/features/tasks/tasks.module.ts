import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksTableComponent } from './tasks-table/tasks-table.component';
import { TasksRoutingModule } from '@feature/tasks/tasks-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { AutosizeModule } from 'ngx-autosize';
import { CronExpressionHelpComponent } from './cron-expression-help/cron-expression-help.component';
import { ActionResultComponent } from './action-result/action-result.component';

@NgModule({
  declarations: [TasksTableComponent, TaskDetailComponent, CronExpressionHelpComponent, ActionResultComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    FontAwesomeModule,
    TasksRoutingModule,
    NgbPaginationModule,
    NgbDropdownModule,
    AutosizeModule,
    FormsModule,
  ],
})
export class TasksModule {}
