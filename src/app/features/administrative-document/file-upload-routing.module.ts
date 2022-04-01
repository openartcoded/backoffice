import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '@core/guards/role.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { DocumentResultComponent } from './document-result/document-result.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentResultComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrativeDocumentRoutingModule {}
