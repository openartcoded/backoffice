import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MemePageComponent } from '@feature/memagram/meme-page/meme-page.component';
import { RoleGuard } from '@core/guards/role.guard';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MemePageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemagramRoutingModule {}
