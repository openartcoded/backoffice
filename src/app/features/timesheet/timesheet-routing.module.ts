import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { RoleGuard } from '@core/guards/role.guard';
import { TimesheetsComponent } from '@feature/timesheet/timesheets/timesheets.component';
import { TimesheetDetailComponent } from '@feature/timesheet/timesheet-detail/timesheet-detail.component';

const routes: Routes = [
  {
    path: '',
    component: TimesheetsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
  {
    path: 'timesheet/:id',
    component: TimesheetDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimesheetRoutingModule {}
