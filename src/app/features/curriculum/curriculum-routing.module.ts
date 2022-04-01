import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CvViewComponent } from './cv-view/cv-view.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { RoleGuard } from '@core/guards/role.guard';
import { CvDownloadRequestComponent } from './cv-download-request/cv-download-request.component';
import { CvEditorComponent } from './cv-editor/cv-editor.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
    component: CvViewComponent,
  },
  {
    path: 'download-requests',
    component: CvDownloadRequestComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
  {
    path: 'editor',
    component: CvEditorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['ADMIN'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurriculumRoutingModule {}
