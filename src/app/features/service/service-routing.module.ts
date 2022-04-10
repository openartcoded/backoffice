import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormContactTableComponent } from './form-contact-table/form-contact-table.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { RoleGuard } from '@core/guards/role.guard';
import { PolicyComponent } from './policy/policy.component';

const routes: Routes = [
  {
    path: 'privacy-policy',
    component: PolicyComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
  {
    path: '',
    component: FormContactTableComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceRoutingModule {}
