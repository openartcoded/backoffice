import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '@core/guards/role.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { BillableClientTableComponent } from './billable-client-table/billable-client-table.component';

const routes: Routes = [
  {
    path: '',
    component: BillableClientTableComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN', 'REGULATOR_OR_ACCOUNTANT'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillableClientRoutingModule {}
