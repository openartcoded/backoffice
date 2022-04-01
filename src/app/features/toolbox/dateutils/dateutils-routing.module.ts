import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DateManipulationComponent } from './date-manipulation/date-manipulation.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { RoleGuard } from '@core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: DateManipulationComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
  {
    path: ':name',
    component: DateManipulationComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DateUtilsRoutingModule {}
