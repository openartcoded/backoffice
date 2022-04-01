import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/user-area/user-area.module').then((m) => m.UserAreaModule),
  },
  {
    path: 'cv',
    loadChildren: () => import('./features/curriculum/curriculum.module').then((m) => m.CurriculumModule),
  },
  {
    path: 'tasks',
    loadChildren: () => import('./features/tasks/tasks.module').then((m) => m.TasksModule),
  },
  {
    path: 'documents',
    loadChildren: () =>
      import('./features/administrative-document/administrative-document.module').then(
        (m) => m.AdministrativeDocumentModule
      ),
  },
  {
    path: 'timesheets',
    loadChildren: () => import('./features/timesheet/timesheet.module').then((m) => m.TimesheetModule),
  },
  {
    path: 'services',
    loadChildren: () => import('./features/service/service.module').then((m) => m.ServiceModule),
  },
  {
    path: 'blog',
    loadChildren: () => import('./features/blog/blog.module').then((m) => m.BlogModule),
  },
  {
    path: 'memzagram',
    loadChildren: () => import('./features/memagram/memagram.module').then((m) => m.MemagramModule),
  },
  {
    path: 'invoice',
    loadChildren: () => import('./features/invoice/invoice.module').then((m) => m.InvoiceModule),
  },
  {
    path: 'file-upload',
    loadChildren: () => import('./features/file-upload/file-upload.module').then((m) => m.FileUploadModule),
  },
  {
    path: 'fee',
    loadChildren: () => import('./features/fee/fee.module').then((m) => m.FeeModule),
  },
  {
    path: 'toolbox',
    loadChildren: () => import('./features/toolbox/toolbox.module').then((m) => m.ToolBoxModule),
  },
  {
    path: 'dossier',
    loadChildren: () => import('./features/dossier/dossier.module').then((m) => m.DossierModule),
  },
  {
    path: 'finance',
    loadChildren: () => import('./features/finance/finance.module').then((m) => m.FinanceModule),
  },
  {
    path: 'endpoint-sparql',
    loadChildren: () => import('./features/sparql/sparql.module').then((m) => m.SparqlModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      initialNavigation: 'enabledNonBlocking', // this should be kept as is for keycloak
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
