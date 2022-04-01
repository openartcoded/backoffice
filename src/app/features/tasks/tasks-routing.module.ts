import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksTableComponent } from '@feature/tasks/tasks-table/tasks-table.component';
import { RoleGuard } from '@core/guards/role.guard';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TasksTableComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
