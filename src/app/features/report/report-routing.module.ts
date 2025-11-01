import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsComponent } from './posts/posts.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { RoleGuard } from '@core/guards/role.guard';
import { PostEditorComponent } from './post-editor/post-editor.component';

const routes: Routes = [
    {
        path: '',
        component: PostsComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: ['ADMIN'] },
    },
    {
        path: 'post/new',
        component: PostEditorComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: ['ADMIN'] },
    },
    {
        path: 'post/:title/:id/edit',
        component: PostEditorComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: ['ADMIN'] },
    },
    {
        path: 'post/:title/:id',
        component: PostDetailComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRole: ['ADMIN'] },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportRoutingModule { }
