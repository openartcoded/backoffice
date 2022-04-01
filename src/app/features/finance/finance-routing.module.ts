import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '@core/guards/role.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { FinancePageComponent } from './finance-page/finance-page.component';

const routes: Routes = [
  {
    path: '',
    component: FinancePageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
  {
    path: ':name',
    component: FinancePageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {}
