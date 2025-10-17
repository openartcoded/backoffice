import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '@core/guards/role.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { DocumentMainPageComponent } from './document-main-page/document-main-page.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentMainPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN', 'REGULATOR_OR_ACCOUNTANT'] },
  },
  {
    path: ':name',
    component: DocumentMainPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN', 'REGULATOR_OR_ACCOUNTANT'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrativeDocumentRoutingModule {}
