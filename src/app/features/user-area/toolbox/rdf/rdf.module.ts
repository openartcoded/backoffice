import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RdfManipulationComponent } from './rdf-manipulation/rdf-manipulation.component';
import { SharedModule } from '@shared/shared.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FileToFileComponent } from './file-to-file/file-to-file.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StringToLangComponent } from './string-to-lang/string-to-lang.component';
import { AutosizeModule } from 'ngx-autosize';
import { ShaclValidationComponent } from './shacl-validation/shacl-validation.component';

@NgModule({
  declarations: [RdfManipulationComponent, FileToFileComponent, StringToLangComponent, ShaclValidationComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbNavModule,
    NgxFileDropModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AutosizeModule,
  ],
  exports: [RdfManipulationComponent],
})
export class RdfModule {}
