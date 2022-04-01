import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '@core/guards/role.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { DossierPageComponent } from './dossier-page/dossier-page.component';

const routes: Routes = [
  {
    path: '',
    component: DossierPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
  {
    path: ':name',
    component: DossierPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DossierRoutingModule {}
