import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToolboxContainerComponent } from './toolbox-container/toolbox-container.component';

const routes: Routes = [
  {
    path: '',
    component: ToolboxContainerComponent,
    children: [
      {
        path: 'date',
        loadChildren: () => import('./dateutils/dateutils.module').then((m) => m.DateUtilsModule),
      },
      {
        path: 'base64',
        loadChildren: () => import('./base64utils/base64utils.module').then((m) => m.Base64UtilsModule),
      },
      {
        path: 'rdf',
        loadChildren: () => import('./rdf/rdf.module').then((m) => m.RdfModule),
      },
      {
        path: 'pathfinder',
        loadChildren: () => import('./pathfinder/pathfinder.module').then((m) => m.PathfinderModule),
      },
      {
        path: '',
        redirectTo: 'date',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToolBoxRoutingModule {}
