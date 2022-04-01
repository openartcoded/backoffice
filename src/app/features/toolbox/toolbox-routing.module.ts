import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToolBoxRoutingModule {}
