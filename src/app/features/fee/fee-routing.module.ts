import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeePageComponent } from './fee-page/fee-page.component';
import { RoleGuard } from '@core/guards/role.guard';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FeePageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN', 'REGULATOR_OR_ACCOUNTANT'] },
  },
  {
    path: ':name',
    component: FeePageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN', 'REGULATOR_OR_ACCOUNTANT'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeeRoutingModule { }
