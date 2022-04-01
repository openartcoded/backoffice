import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
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

@NgModule({
  declarations: [
    EditPasswordComponent,
    TitleComponent,
    SlugifyPipe,
    SortPipe,
    PdfViewerComponent,
    ImageViewerComponent,
    ImageLoaderComponent,
    TrimPipe,
    EditEmailComponent,
    BytesToHumanPipe,
  ],
  exports: [
    TitleComponent,
    PdfViewerComponent,
    SortPipe,
    ImageViewerComponent,
    SlugifyPipe,
    ImageLoaderComponent,
    TrimPipe,
    BytesToHumanPipe
  ],
  imports: [CommonModule, NgbToastModule, FontAwesomeModule, NgbDropdownModule, ReactiveFormsModule, PdfViewerModule],
  providers: [SlugifyPipe, SortPipe],
})
export class SharedModule {}
