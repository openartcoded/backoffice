import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TitleComponent } from './title/title.component';
import { SlugifyPipe } from '@core/pipe/slugify-pipe';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { ImageLoaderComponent } from './image-loader/image-loader.component';
import { SortPipe } from '@core/pipe/sort-pipe';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { TrimPipe } from './pipes/trim.pipe';
import { EditEmailComponent } from './edit-email/edit-email.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BytesToHumanPipe } from './pipes/bytes-to-human.pipe';
import { StopPropagationDirective } from './directives/stop.propagation.directive';
import { MailFormComponent } from './mail-form/mail-form.component';
import { AutosizeModule } from 'ngx-autosize';
import { ChipsModule } from 'primeng/chips';
import { SmsFormComponent } from './sms-form/sms-form.component';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/mode-markdown';
import { CopyToClipboardComponent } from './copy-to-clipboard/copy-to-clipboard.component';
import("marked").then(m => {
    (window as any).marked = m.marked;
});
@NgModule({
    declarations: [
        EditPasswordComponent,
        TitleComponent,
        SlugifyPipe,
        SortPipe,
        PdfViewerComponent,
        CopyToClipboardComponent,
        ImageViewerComponent,
        ImageLoaderComponent,
        TrimPipe,
        StopPropagationDirective,
        EditEmailComponent,
        BytesToHumanPipe,
        MailFormComponent,
        SmsFormComponent,
        AutoFocusDirective,
    ],
    exports: [
        CopyToClipboardComponent,
        TitleComponent,
        PdfViewerComponent,
        MailFormComponent,
        SmsFormComponent,
        SortPipe,
        ImageViewerComponent,
        SlugifyPipe,
        ImageLoaderComponent,
        StopPropagationDirective,
        TrimPipe,
        BytesToHumanPipe, AutoFocusDirective
    ],
    imports: [
        CommonModule,
        AutosizeModule,
        ChipsModule,
        NgbToastModule,
        FontAwesomeModule,
        NgbDropdownModule,
        LMarkdownEditorModule,
        FormsModule,
        ReactiveFormsModule,
        PdfViewerModule,
    ],
    providers: [SlugifyPipe, SortPipe],
})
export class SharedModule { }
