import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SparqlModule } from '@feature/sparql/sparql.module';

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
                (m) => m.AdministrativeDocumentModule,
            ),
    },
    {
        path: 'billable-clients',
        loadChildren: () => import('./features/billable-client/billable-client.module').then((m) => m.BillableClientModule),
    },
    {
        path: 'timesheets',
        loadChildren: () => import('./features/timesheet/timesheet.module').then((m) => m.TimesheetModule),
    },
    {
        path: 'mails',
        loadChildren: () => import('./features/mail/mail.module').then((m) => m.MailModule),
    },
    {
        path: 'services',
        loadChildren: () => import('./features/service/service.module').then((m) => m.ServiceModule),
    },
    {
        path: 'report',
        loadChildren: () => import('./features/report/report.module').then((m) => m.ReportModule),
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
        path: 'dossier',
        loadChildren: () => import('./features/dossier/dossier.module').then((m) => m.DossierModule),
    },
    {
        path: 'finance',
        loadChildren: () => import('./features/finance/finance.module').then((m) => m.FinanceModule),
    },
    {
        path: 'endpoint-sparql',
        loadChildren: () => SparqlModule,
    },
    {
        path: '**',
        redirectTo: '404',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: false,
            initialNavigation: 'enabledNonBlocking',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }
